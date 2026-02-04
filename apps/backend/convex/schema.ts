import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { act } from "react";

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
    zoneId: v.optional(v.id("zones")),
  })
    .index("by_auth", ["authId"])
    .index("by_zone", ["zoneId"]),

  zones: defineTable({
    name: v.string(),
    description: v.string(),
    polygon: v.array(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ), //consider list of circles or stadiums for collision performance
  }),

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

  activity: defineTable({
    creatorId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    location: v.union(
      v.id("zones"),
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
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
});
