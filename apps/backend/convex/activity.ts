import {
  internalMutation,
  mutation,
  query,
  MutationCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const deleteActivityRecords = async (
  ctx: MutationCtx,
  activityId: Id<"activity">,
) => {
  const members = await ctx.db
    .query("activityMember")
    .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
    .collect();

  const requests = await ctx.db
    .query("activityRequest")
    .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
    .collect();

  const invites = await ctx.db
    .query("activityInvite")
    .withIndex("by_activity_to", (q) => q.eq("activityId", activityId))
    .collect();

  const messages = await ctx.db
    .query("activityMessage")
    .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
    .collect();

  const topics = await ctx.db
    .query("activityTopic")
    .withIndex("by_activity", (q) => q.eq("activityId", activityId))
    .collect();

  await Promise.all([
    ...members.map((m) => ctx.db.delete(m._id)),
    ...requests.map((r) => ctx.db.delete(r._id)),
    ...invites.map((i) => ctx.db.delete(i._id)),
    ...messages.map((m) => ctx.db.delete(m._id)),
    ...topics.map((t) => ctx.db.delete(t._id)),
  ]);

  await ctx.db.delete(activityId);
};

export const createActivity = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    location: v.union(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
    locationDetails: v.optional(v.string()),
    time: v.optional(v.number()),
    maxSize: v.optional(v.number()),
    byApproval: v.boolean(),
    expirationTime: v.number(),
    activityTopics: v.optional(v.array(v.id("topic"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activityId = await ctx.db.insert("activity", {
      creatorId: currentUser._id,
      title: args.title,
      description: args.description,
      location: args.location,
      locationDetails: args.locationDetails,
      time: args.time,
      maxSize: args.maxSize,
      byApproval: args.byApproval,
      expirationTime: args.expirationTime,
    });

    if (args.activityTopics) {
      for (const topicId of args.activityTopics) {
        await ctx.db.insert("activityTopic", {
          activityId,
          topicId,
        });
      }
    }

    await ctx.scheduler.runAt(
      args.expirationTime,
      internal.activity.expireActivity,
      { activityId },
    );

    await ctx.db.insert("activityMember", {
      activityId,
      userId: currentUser._id,
    });

    return activityId;
  },
});

export const addActivityTopic = mutation({
  args: {
    activityId: v.id("activity"),
    topicId: v.id("topic"),
  },
  handler: async (ctx, { activityId, topicId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.creatorId !== currentUser._id) {
      throw new Error("Not activity creator");
    }

    const topic = await ctx.db.get(topicId);
    if (!topic) throw new Error("Topic not found");

    const existingTopic = await ctx.db
      .query("activityTopic")
      .withIndex("by_activity_topic", (q) =>
        q.eq("activityId", activityId).eq("topicId", topicId),
      )
      .first();

    if (existingTopic) return existingTopic._id;

    return await ctx.db.insert("activityTopic", {
      activityId,
      topicId,
    });
  },
});

export const removeActivityTopic = mutation({
  args: {
    activityId: v.id("activity"),
    topicId: v.id("topic"),
  },
  handler: async (ctx, { activityId, topicId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.creatorId !== currentUser._id) {
      throw new Error("Not activity creator");
    }

    const existingTopic = await ctx.db
      .query("activityTopic")
      .withIndex("by_activity_topic", (q) =>
        q.eq("activityId", activityId).eq("topicId", topicId),
      )
      .first();

    if (!existingTopic) return;

    await ctx.db.delete(existingTopic._id);
  },
});

export const expireActivity = internalMutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const activity = await ctx.db.get(activityId);
    if (!activity) return;

    if (activity.expirationTime > Date.now()) return;

    await deleteActivityRecords(ctx, activityId);
  },
});

export const joinActivity = mutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.byApproval) return;

    const members = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
      .collect();

    if (activity.maxSize !== undefined && members.length >= activity.maxSize) {
      return;
    }

    const existingMember = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (existingMember) return;

    await ctx.db.insert("activityMember", {
      activityId,
      userId: currentUser._id,
    });
  },
});

export const requestJoinActivity = mutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (!activity.byApproval) return;

    const members = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
      .collect();

    if (activity.maxSize !== undefined && members.length >= activity.maxSize) {
      return;
    }

    const existingMember = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (existingMember) return;

    const existingRequest = await ctx.db
      .query("activityRequest")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (existingRequest) return;

    await ctx.db.insert("activityRequest", {
      activityId,
      userId: currentUser._id,
    });
  },
});

export const acceptActivityRequest = mutation({
  args: {
    activityId: v.id("activity"),
    userId: v.id("users"),
  },
  handler: async (ctx, { activityId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.creatorId !== currentUser._id) {
      throw new Error("Not activity creator");
    }

    const request = await ctx.db
      .query("activityRequest")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", userId),
      )
      .first();

    if (!request) return;

    const existingMember = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", userId),
      )
      .first();

    if (!existingMember) {
      await ctx.db.insert("activityMember", {
        activityId,
        userId,
      });
    }

    await ctx.db.delete(request._id);
  },
});

export const denyActivityRequest = mutation({
  args: {
    activityId: v.id("activity"),
    userId: v.id("users"),
  },
  handler: async (ctx, { activityId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.creatorId !== currentUser._id) {
      throw new Error("Not activity creator");
    }

    const request = await ctx.db
      .query("activityRequest")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", userId),
      )
      .first();

    if (!request) return;

    await ctx.db.delete(request._id);
  },
});

export const deleteActivity = mutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.creatorId !== currentUser._id) {
      throw new Error("Not activity creator");
    }

    await deleteActivityRecords(ctx, activityId);
  },
});

export const leaveActivity = mutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const existingMember = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (!existingMember) return;

    await ctx.db.delete(existingMember._id);
  },
});

export const inviteToActivity = mutation({
  args: {
    activityId: v.id("activity"),
    userId: v.id("users"),
  },
  handler: async (ctx, { activityId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");
    if (currentUser._id === userId) return;

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    const member = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (!member) throw new Error("Not activity member");

    const targetMember = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", userId),
      )
      .first();

    if (targetMember) return;

    const targetRequest = await ctx.db
      .query("activityRequest")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", userId),
      )
      .first();

    if (targetRequest) return;

    const existingInvite = await ctx.db
      .query("activityInvite")
      .withIndex("by_activity_to", (q) =>
        q.eq("activityId", activityId).eq("toUserId", userId),
      )
      .first();

    if (existingInvite) return;

    await ctx.db.insert("activityInvite", {
      activityId,
      fromUserId: currentUser._id,
      toUserId: userId,
    });
  },
});

export const acceptActivityInvite = mutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    const invite = await ctx.db
      .query("activityInvite")
      .withIndex("by_activity_to", (q) =>
        q.eq("activityId", activityId).eq("toUserId", currentUser._id),
      )
      .first();

    if (!invite) return;

    const existingMember = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (existingMember) {
      await ctx.db.delete(invite._id);
      return;
    }

    const existingRequest = await ctx.db
      .query("activityRequest")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (existingRequest) {
      await ctx.db.delete(invite._id);
      return;
    }

    await ctx.db.delete(invite._id);

    const members = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
      .collect();

    if (activity.maxSize !== undefined && members.length >= activity.maxSize) {
      return;
    }

    if (activity.byApproval) {
      await ctx.db.insert("activityRequest", {
        activityId,
        userId: currentUser._id,
      });
      return;
    }

    await ctx.db.insert("activityMember", {
      activityId,
      userId: currentUser._id,
    });
  },
});

export const denyActivityInvite = mutation({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const invite = await ctx.db
      .query("activityInvite")
      .withIndex("by_activity_to", (q) =>
        q.eq("activityId", activityId).eq("toUserId", currentUser._id),
      )
      .first();

    if (!invite) return;

    await ctx.db.delete(invite._id);
  },
});

export const sendActivityMessage = mutation({
  args: {
    activityId: v.id("activity"),
    text: v.string(),
  },
  handler: async (ctx, { activityId, text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const member = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (!member) throw new Error("Not activity member");

    return await ctx.db.insert("activityMessage", {
      activityId,
      userId: currentUser._id,
      text,
      timestamp: Date.now(),
    });
  },
});

export const editActivityMessage = mutation({
  args: {
    messageId: v.id("activityMessage"),
    text: v.string(),
  },
  handler: async (ctx, { messageId, text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    const member = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", message.activityId).eq("userId", currentUser._id),
      )
      .first();

    if (!member) throw new Error("Not activity member");

    await ctx.db.patch(messageId, {
      text,
      editedAt: Date.now(),
    });
  },
});

export const listMyActivities = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const memberships = await ctx.db
      .query("activityMember")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const activities = await Promise.all(
      memberships.map((m) => ctx.db.get(m.activityId)),
    );

    return activities.filter((a) => a !== null && a !== undefined);
  },
});

export const getActivityMembers = query({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.byApproval) {
      const member = await ctx.db
        .query("activityMember")
        .withIndex("by_activity_user", (q) =>
          q.eq("activityId", activityId).eq("userId", currentUser._id),
        )
        .first();

      if (!member) throw new Error("Not activity member");
    }

    const memberships = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
      .collect();

    const users = await Promise.all(
      memberships.map((m) => ctx.db.get(m.userId)),
    );

    return users
      .filter((u) => u !== null && u !== undefined)
      .map(({ authId, ...rest }) => rest);
  },
});

export const getActivityRequests = query({
  args: {
    activityId: v.id("activity"),
  },
  handler: async (ctx, { activityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    if (activity.creatorId !== currentUser._id) {
      throw new Error("Not activity creator");
    }

    return await ctx.db
      .query("activityRequest")
      .withIndex("by_activity_user", (q) => q.eq("activityId", activityId))
      .collect();
  },
});

export const getActivityInvites = query({
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
      .query("activityInvite")
      .withIndex("by_to", (q) => q.eq("toUserId", currentUser._id))
      .collect();
  },
});

export const listActivities = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activity").collect();
  },
});

export const loadActivityMessages = query({
  args: {
    activityId: v.id("activity"),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { activityId, cursor, limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const member = await ctx.db
      .query("activityMember")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", activityId).eq("userId", currentUser._id),
      )
      .first();

    if (!member) throw new Error("Not activity member");

    return await ctx.db
      .query("activityMessage")
      .withIndex("by_activity_time", (q) => q.eq("activityId", activityId))
      .order("desc")
      .paginate({
        cursor: cursor ?? null,
        numItems: limit ?? 50,
      });
  },
});
