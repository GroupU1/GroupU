import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const mutateUser = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    nickname: v.optional(v.string()),
    collegeYear: v.optional(v.string()),
    major: v.optional(v.string()),
    concentration: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const authId = identity.subject;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", authId))
      .unique();

    const payload = {
      firstName: args.firstName,
      lastName: args.lastName,
      nickname: args.nickname,
      collegeYear: args.collegeYear,
      major: args.major,
      concentration: args.concentration,
      bio: args.bio,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      authId,
      ...payload,
    });
  },
});

export const listUsersPublic = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(({ _id, authId, ...rest }) => rest);
  },
});
