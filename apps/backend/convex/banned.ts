import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const banUser = mutation({
  args: {
    bannedUserId: v.id("users"),
  },
  handler: async (ctx, { bannedUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");
    if (currentUser._id === bannedUserId) return;

    const existingBan = await ctx.db
      .query("banned")
      .withIndex("by_from_banned", (q) =>
        q.eq("fromUserId", currentUser._id).eq("bannedUserId", bannedUserId),
      )
      .first();

    if (existingBan) return;

    await ctx.db.insert("banned", {
      fromUserId: currentUser._id,
      bannedUserId,
    });
  },
});

export const unbanUser = mutation({
  args: {
    bannedUserId: v.id("users"),
  },
  handler: async (ctx, { bannedUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");
    if (currentUser._id === bannedUserId) return;

    const existingBan = await ctx.db
      .query("banned")
      .withIndex("by_from_banned", (q) =>
        q.eq("fromUserId", currentUser._id).eq("bannedUserId", bannedUserId),
      )
      .first();

    if (!existingBan) return;

    await ctx.db.delete(existingBan._id);
  },
});

export const listCurrentBans = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    return await ctx.db
      .query("banned")
      .withIndex("by_from_banned", (q) => q.eq("fromUserId", currentUser._id))
      .collect();
  },
});
