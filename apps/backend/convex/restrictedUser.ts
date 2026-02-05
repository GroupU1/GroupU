import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const restrictUser = mutation({
  args: {
    restrictedUserId: v.id("users"),
  },
  handler: async (ctx, { restrictedUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");
    if (currentUser._id === restrictedUserId) return;

    const existingRestriction = await ctx.db
      .query("restrictedUser")
      .withIndex("by_from_restricted", (q) =>
        q
          .eq("fromUserId", currentUser._id)
          .eq("restrictedUserId", restrictedUserId),
      )
      .first();

    if (existingRestriction) return;

    await ctx.db.insert("restrictedUser", {
      fromUserId: currentUser._id,
      restrictedUserId,
    });
  },
});

export const unrestrictUser = mutation({
  args: {
    restrictedUserId: v.id("users"),
  },
  handler: async (ctx, { restrictedUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");
    if (currentUser._id === restrictedUserId) return;

    const existingRestriction = await ctx.db
      .query("restrictedUser")
      .withIndex("by_from_restricted", (q) =>
        q
          .eq("fromUserId", currentUser._id)
          .eq("restrictedUserId", restrictedUserId),
      )
      .first();

    if (!existingRestriction) return;

    await ctx.db.delete(existingRestriction._id);
  },
});

export const listRestrictedUser = query({
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
      .query("restrictedUser")
      .withIndex("by_from_restricted", (q) =>
        q.eq("fromUserId", currentUser._id),
      )
      .collect();
  },
});
