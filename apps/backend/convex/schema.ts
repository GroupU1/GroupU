import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    nickname: v.optional(v.string()),
    collegeYear: v.optional(v.string()),
    major: v.optional(v.string()),
    minor: v.optional(v.string()),
    concentration: v.optional(v.string()),
    bio: v.optional(v.string()),
    visibility: v.union(
      v.literal("public"),
      v.literal("friends"),
      v.literal("private"),
    ),
  }).index("by_auth", ["authId"]),

  statuses: defineTable({
    userId: v.id("users"),
    text: v.string(),
    expirationTime: v.number(),
  }).index("by_user", ["userId"]),

  friends: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
  })
    .index("by_from", ["fromUserId", "toUserId"])
    .index("by_to", ["toUserId", "fromUserId"]),

  friendRequest: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    expirationTime: v.number(),
  })
    .index("by_from", ["fromUserId", "toUserId"])
    .index("by_to", ["toUserId", "fromUserId"]),

  banned: defineTable({
    fromUserId: v.id("users"),
    bannedUserId: v.id("users"),
  }).index("by_from_banned", ["fromUserId", "bannedUserId"]),

  restrictedUser: defineTable({
    fromUserId: v.id("users"),
    restrictedUserId: v.id("users"),
  }).index("by_from_restricted", ["fromUserId", "restrictedUserId"]),

  activity: defineTable({
    creatorId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    locationDetails: v.optional(v.string()),
    time: v.optional(v.number()), //exact time or in 20 minutes??
    maxSize: v.number(),
    byApproval: v.boolean(),
    expirationTime: v.number(),
  }),

  activityMember: defineTable({
    // delete related entries on activity deletion
    activityId: v.id("activity"),
    userId: v.id("users"),
  }).index("by_activity_user", ["activityId", "userId"]),

  activityRequest: defineTable({
    // delete related entries on activity deletion
    activityId: v.id("activity"),
    userId: v.id("users"),
  }).index("by_activity_user", ["activityId", "userId"]),

  activityInvite: defineTable({
    // delete related entries on activity deletion
    activityId: v.id("activity"),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
  }).index("by_activity_to", ["activityId", "toUserId"]),

  activityMessage: defineTable({
    // delete related entries on activity deletion
    activityId: v.id("activity"),
    userId: v.id("users"),
    text: v.string(),
    timestamp: v.number(),
  }).index("by_activity_user", ["activityId", "userId"]),

  dmChat: defineTable({
    // max 10 members
    name: v.optional(v.string()),
  }),

  dmChatMember: defineTable({
    chatId: v.id("dmChat"),
    userId: v.id("users"),
  })
    .index("by_chat", ["chatId"])
    .index("by_user", ["userId"]),

  dm: defineTable({
    chatId: v.id("dmChat"),
    senderId: v.id("users"),
    text: v.string(),
    timestamp: v.number(),
    editedAt: v.optional(v.number()),
  })
    .index("by_chat_sender", ["chatId", "senderId"])
    .index("by_chat_time", ["chatId", "timestamp"]),
});
