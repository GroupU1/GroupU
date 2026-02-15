import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

export const createTopic = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const topicId = await ctx.db.insert("topic", {
      name,
    });

    return topicId;
  },
});

export const deleteTopic = internalMutation({
  args: {
    topicId: v.id("topic"),
  },
  handler: async (ctx, { topicId }) => {
    const topic = await ctx.db.get(topicId);
    if (!topic) return;

    const linkedActivityTopics = await ctx.db.query("activityTopic").collect();
    await Promise.all(
      linkedActivityTopics
        .filter((item) => item.topicId === topicId)
        .map((item) => ctx.db.delete(item._id)),
    );

    await ctx.db.delete(topicId);
  },
});
