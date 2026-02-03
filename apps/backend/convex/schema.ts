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
    concentration: v.optional(v.string()),
    bio: v.optional(v.string()),
    zoneId: v.optional(v.id("zones")),
  })
    .index("by_auth", ["authId"])
    .index("by_zone", ["zoneId"]),
  zones: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),
});
