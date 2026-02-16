import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

export const createTopics = mutation({
  args: {
    names: v.array(v.string()),
  },
  handler: async (ctx, { names }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const trimmedNames = Array.from(
      new Set(names.map((name) => name.trim()).filter(Boolean)),
    );

    if (!trimmedNames.length) {
      throw new Error("At least one valid topic name is required");
    }

    const topicIds = [];

    for (const name of trimmedNames) {
      const existingTopic = await ctx.db
        .query("topic")
        .withIndex("by_name", (q) => q.eq("name", name))
        .first();

      if (existingTopic) {
        topicIds.push(existingTopic._id);
        continue;
      }

      const topicId = await ctx.db.insert("topic", { name });
      topicIds.push(topicId);
    }

    return topicIds;
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
