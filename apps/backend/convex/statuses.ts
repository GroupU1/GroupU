import { mutation, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const setStatus = mutation({
  args: {
    userId: v.id("users"),
    text: v.string(),
    expirationTime: v.number(),
  },
  handler: async (ctx, { userId, text, expirationTime }) => {
    if (text.length > 50) {
      throw new Error("Status must be 50 characters or fewer.");
    }

    const existing = await ctx.db
      .query("statuses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { text, expirationTime });
      await ctx.scheduler.runAt(
        expirationTime,
        internal.statuses.expireStatus,
        { statusId: existing._id },
      );
      return existing._id;
    }

    const id = await ctx.db.insert("statuses", {
      userId,
      text,
      expirationTime,
    });
    await ctx.scheduler.runAt(expirationTime, internal.statuses.expireStatus, {
      statusId: id,
    });
    return id;
  },
});

export const expireStatus = internalMutation({
  args: { statusId: v.id("statuses") },
  handler: async (ctx, { statusId }) => {
    const status = await ctx.db.get(statusId);
    if (!status) return;

    // Only delete if the most recent expiration time has passed
    if (status.expirationTime <= Date.now()) {
      await ctx.db.delete(statusId);
    }
  },
});

export const getStatus = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("statuses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});
