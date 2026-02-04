import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./ratelimiter";

export const sendDm = mutation({
  args: {
    chatId: v.id("dmChat"),
    text: v.string(),
  },
  handler: async (ctx, { chatId, text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const fromUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();
    if (!fromUser) throw new Error("User not found");

    await rateLimiter.limit(ctx, "dm", { key: fromUser._id, throws: true });

    const chat = await ctx.db.get(chatId);
    if (!chat) throw new Error("Chat not found");

    const member = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), fromUser._id))
      .first();

    if (!member) throw new Error("Not a chat member");

    return await ctx.db.insert("dm", {
      chatId,
      senderId: fromUser._id,
      text,
      timestamp: Date.now(),
    });
  },
});

export const createChat = mutation({
  args: {
    userIds: v.array(v.id("users")),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { userIds, name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const uniqueUserIds = Array.from(
      new Set(userIds.filter((id) => id !== currentUser._id)),
    );

    if (uniqueUserIds.length + 1 > 10) {
      throw new Error("Chat size limit exceeded");
    }

    for (const targetUserId of uniqueUserIds) {
      const banned = await ctx.db
        .query("banned")
        .withIndex("by_from_banned", (q) =>
          q.eq("fromUserId", targetUserId).eq("bannedUserId", currentUser._id),
        )
        .first();

      if (banned) throw new Error("User has banned you");
    }

    const chatId = await ctx.db.insert("dmChat", { name });

    await ctx.db.insert("dmChatMember", {
      chatId,
      userId: currentUser._id,
    });

    for (const targetUserId of uniqueUserIds) {
      await ctx.db.insert("dmChatMember", {
        chatId,
        userId: targetUserId,
      });
    }

    return chatId;
  },
});

export const addMember = mutation({
  args: {
    chatId: v.id("dmChat"),
    userId: v.id("users"),
  },
  handler: async (ctx, { chatId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const chat = await ctx.db.get(chatId);
    if (!chat) throw new Error("Chat not found");

    const member = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!member) throw new Error("Not a chat member");

    const targetUser = await ctx.db.get(userId);
    if (!targetUser) throw new Error("User not found");

    const banned = await ctx.db
      .query("banned")
      .withIndex("by_from_banned", (q) =>
        q.eq("fromUserId", userId).eq("bannedUserId", currentUser._id),
      )
      .first();

    if (banned) throw new Error("User has banned you");

    const existingMember = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingMember) return;

    const members = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .collect();

    if (members.length + 1 > 10) {
      throw new Error("Chat size limit exceeded");
    }

    await ctx.db.insert("dmChatMember", {
      chatId,
      userId,
    });
  },
});

export const leaveChat = mutation({
  args: {
    chatId: v.id("dmChat"),
  },
  handler: async (ctx, { chatId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const member = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!member) return;

    await ctx.db.delete(member._id);
  },
});

export const getDmChats = query({
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
      .query("dmChatMember")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const chats = await Promise.all(
      memberships.map((m) => ctx.db.get(m.chatId)),
    );

    return chats.filter((c) => c !== null && c !== undefined);
  },
});

export const getUsersInChat = query({
  args: {
    chatId: v.id("dmChat"),
  },
  handler: async (ctx, { chatId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const member = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!member) throw new Error("Not a chat member");

    const memberships = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .collect();

    const users = await Promise.all(
      memberships.map((m) => ctx.db.get(m.userId)),
    );

    return users
      .filter((u) => u !== null && u !== undefined)
      .map(({ authId, ...rest }) => rest);
  },
});

export const loadDms = query({
  args: {
    chatId: v.id("dmChat"),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { chatId, cursor, limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const member = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!member) throw new Error("Not a chat member");

    return await ctx.db
      .query("dm")
      .withIndex("by_chat_time", (q) => q.eq("chatId", chatId))
      .order("desc")
      .paginate({
        cursor: cursor ?? null,
        numItems: limit ?? 50,
      });
  },
});

export const editDm = mutation({
  args: {
    dmId: v.id("dm"),
    text: v.string(),
  },
  handler: async (ctx, { dmId, text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const dm = await ctx.db.get(dmId);
    if (!dm) throw new Error("Message not found");

    if (dm.senderId !== currentUser._id) throw new Error("Not message sender");

    const member = await ctx.db
      .query("dmChatMember")
      .withIndex("by_chat", (q) => q.eq("chatId", dm.chatId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!member) throw new Error("Not a chat member");

    await ctx.db.patch(dmId, {
      text,
      editedAt: Date.now(),
    });
  },
});
