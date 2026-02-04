import { query } from "./_generated/server";
import { v } from "convex/values";

export const getZones = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("zones").collect();
  },
});

export const getUsersInZone = query({
  args: { zoneId: v.id("zones") },
  handler: async (ctx, { zoneId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_zone", (q) => q.eq("zoneId", zoneId))
      .collect();
  },
});
