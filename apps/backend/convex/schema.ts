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
    zoneId: v.optional(v.id("zones")),
  })
    .index("by_auth", ["authId"])
    .index("by_zone", ["zoneId"]),

  zones: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  statuses: defineTable({
    userId: v.id("users"),
    text: v.string(),
    expirationTime: v.number(), // ms since epoch
  }).index("by_user", ["userId"]),

  friends: defineTable({
    fromUserId: v.id("users"), // requester
    toUserId: v.id("users"), // recipient
    status: v.union(v.literal("pending"), v.literal("accepted")),
  })
    .index("by_from", ["fromUserId", "toUserId"])
    .index("by_to", ["toUserId", "fromUserId"]),

  banned: defineTable({
    fromUserId: v.id("users"),
    bannedUserId: v.id("users"),
  }).index("by_from_banned", ["fromUserId", "bannedUserId"]),
});
