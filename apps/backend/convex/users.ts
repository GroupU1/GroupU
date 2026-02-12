import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertUser = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    nickname: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    collegeYear: v.optional(v.string()),
    major: v.optional(v.string()),
    minor: v.optional(v.string()),
    concentration: v.optional(v.string()),
    bio: v.optional(v.string()),
    visibility: v.optional(
      v.union(v.literal("public"), v.literal("friends"), v.literal("private")),
    ),
  },
  handler: async (ctx, args) => {
    if (args.firstName.length > 50) {
      throw new Error("First name must be 50 characters or fewer");
    }

    if (args.lastName.length > 50) {
      throw new Error("Last name must be 50 characters or fewer");
    }

    if (args.nickname && args.nickname.length > 50) {
      throw new Error("Nickname must be 50 characters or fewer");
    }

    if (args.pronouns && args.pronouns.length > 30) {
      throw new Error("Pronouns must be 30 characters or fewer");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const authId = identity.subject;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", authId))
      .unique();

    const payload = {
      firstName: args.firstName,
      lastName: args.lastName,
      nickname: args.nickname,
      pronouns: args.pronouns,
      collegeYear: args.collegeYear,
      major: args.major,
      minor: args.minor,
      concentration: args.concentration,
      bio: args.bio,
      visibility: args.visibility,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      authId,
      ...payload,
      visibility: payload.visibility ?? "public",
    });
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(({ authId, ...rest }) => rest);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();
  },
});

export const updateVisibility = mutation({
  args: {
    visibility: v.union(
      v.literal("public"),
      v.literal("friends"),
      v.literal("private"),
    ),
  },
  handler: async (ctx, { visibility }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!existing) throw new Error("User not found");

    await ctx.db.patch(existing._id, {
      visibility,
      ...(visibility === "private" ? { location: undefined } : {}),
    });

    return existing._id;
  },
});
