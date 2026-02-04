import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendRequest = mutation({
  args: {
    toUserId: v.id("users"),
  },
  handler: async (ctx, { toUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");
    if (currentUser._id === toUserId) return;

    const banned = await ctx.db
      .query("banned")
      .withIndex("by_from_banned", (q) =>
        q.eq("fromUserId", toUserId).eq("bannedUserId", currentUser._id),
      )
      .first();
    if (banned) return;

    const existingFrom = await ctx.db
      .query("friends")
      .withIndex("by_from", (q) =>
        q.eq("fromUserId", currentUser._id).eq("toUserId", toUserId),
      )
      .first();

    const existingTo = await ctx.db
      .query("friends")
      .withIndex("by_from", (q) =>
        q.eq("fromUserId", toUserId).eq("toUserId", currentUser._id),
      )
      .first();

    if (existingFrom || existingTo) return;

    await ctx.db.insert("friends", {
      fromUserId: currentUser._id,
      toUserId,
      status: "pending",
    });
  },
});

export const acceptRequest = mutation({
  args: {
    fromUserId: v.id("users"),
  },
  handler: async (ctx, { fromUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const request = await ctx.db
      .query("friends")
      .withIndex("by_from", (q) =>
        q.eq("fromUserId", fromUserId).eq("toUserId", currentUser._id),
      )
      .first();

    if (!request || request.status !== "pending") return;

    await ctx.db.patch(request._id, { status: "accepted" });
  },
});

export const rejectRequest = mutation({
  args: {
    fromUserId: v.id("users"),
  },
  handler: async (ctx, { fromUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const request = await ctx.db
      .query("friends")
      .withIndex("by_from", (q) =>
        q.eq("fromUserId", fromUserId).eq("toUserId", currentUser._id),
      )
      .first();

    if (!request || request.status !== "pending") return;

    await ctx.db.delete(request._id);
  },
});

//maybe change args from userId to authId
export const listFriends = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const outgoing = await ctx.db
      .query("friends")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .collect();

    const incoming = await ctx.db
      .query("friends")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .collect();

    const accepted = [
      ...outgoing.filter((f) => f.status === "accepted").map((f) => f.toUserId),
      ...incoming
        .filter((f) => f.status === "accepted")
        .map((f) => f.fromUserId),
    ];

    const friends = await Promise.all(
      accepted.map((id) => ctx.db.get("users", id)),
    );

    return friends
      .filter((f) => f !== null && f !== undefined)
      .map(({ authId, ...rest }) => rest);
  },
});
