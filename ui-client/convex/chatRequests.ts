import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeWallet, sortedWalletPair } from "./lib";

export const sendRequest = mutation({
  args: {
    fromWallet: v.string(),
    toWallet: v.string(),
  },
  handler: async (ctx, args) => {
    const fromWallet = normalizeWallet(args.fromWallet);
    const toWallet = normalizeWallet(args.toWallet);

    if (!fromWallet || !toWallet) {
      throw new Error("fromWallet and toWallet are required");
    }
    if (fromWallet === toWallet) {
      throw new Error("Cannot send a chat request to yourself");
    }

    const fromUser = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", fromWallet))
      .unique();
    if (!fromUser?.publicKey) {
      throw new Error("Register your public key before sending requests");
    }

    const toUser = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", toWallet))
      .unique();
    if (!toUser?.publicKey) {
      throw new Error("Peer has not registered a public key yet");
    }

    const existingForward = await ctx.db
      .query("chatRequests")
      .withIndex("by_pair", (q) =>
        q.eq("fromWallet", fromWallet).eq("toWallet", toWallet)
      )
      .unique();

    if (existingForward && existingForward.status !== "rejected") {
      throw new Error("Chat request already exists");
    }

    const existingReverse = await ctx.db
      .query("chatRequests")
      .withIndex("by_pair", (q) =>
        q.eq("fromWallet", toWallet).eq("toWallet", fromWallet)
      )
      .unique();

    if (existingReverse?.status === "accepted") {
      throw new Error("You are already friends");
    }

    if (existingReverse?.status === "pending") {
      // Auto-accept reciprocal pending request
      const now = Date.now();
      await ctx.db.patch(existingReverse._id, {
        status: "accepted",
        updatedAt: now,
      });
      const pair = sortedWalletPair(fromWallet, toWallet);
      const friendship = await ctx.db
        .query("friendships")
        .withIndex("by_pair", (q) =>
          q.eq("walletA", pair.walletA).eq("walletB", pair.walletB)
        )
        .unique();
      if (!friendship) {
        await ctx.db.insert("friendships", {
          ...pair,
          createdAt: now,
        });
      }
      return existingReverse._id;
    }

    const now = Date.now();
    if (existingForward?.status === "rejected") {
      await ctx.db.patch(existingForward._id, {
        status: "pending",
        updatedAt: now,
      });
      return existingForward._id;
    }

    return await ctx.db.insert("chatRequests", {
      fromWallet,
      toWallet,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const acceptRequest = mutation({
  args: {
    requestId: v.id("chatRequests"),
    toWallet: v.string(),
  },
  handler: async (ctx, args) => {
    const toWallet = normalizeWallet(args.toWallet);
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.toWallet !== toWallet) {
      throw new Error("Only the recipient can accept this request");
    }
    if (request.status !== "pending") {
      throw new Error("Request is not pending");
    }

    const now = Date.now();
    await ctx.db.patch(request._id, {
      status: "accepted",
      updatedAt: now,
    });

    const pair = sortedWalletPair(request.fromWallet, request.toWallet);
    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("walletA", pair.walletA).eq("walletB", pair.walletB)
      )
      .unique();

    if (!friendship) {
      await ctx.db.insert("friendships", {
        ...pair,
        createdAt: now,
      });
    }

    return request._id;
  },
});

export const rejectRequest = mutation({
  args: {
    requestId: v.id("chatRequests"),
    toWallet: v.string(),
  },
  handler: async (ctx, args) => {
    const toWallet = normalizeWallet(args.toWallet);
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.toWallet !== toWallet) {
      throw new Error("Only the recipient can reject this request");
    }
    if (request.status !== "pending") {
      throw new Error("Request is not pending");
    }

    await ctx.db.patch(request._id, {
      status: "rejected",
      updatedAt: Date.now(),
    });
    return request._id;
  },
});

export const listPendingForWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    return await ctx.db
      .query("chatRequests")
      .withIndex("by_to_status", (q) =>
        q.eq("toWallet", walletAddress).eq("status", "pending")
      )
      .collect();
  },
});

export const listFriends = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const asA = await ctx.db
      .query("friendships")
      .withIndex("by_wallet_a", (q) => q.eq("walletA", walletAddress))
      .collect();
    const asB = await ctx.db
      .query("friendships")
      .withIndex("by_wallet_b", (q) => q.eq("walletB", walletAddress))
      .collect();

    const friends = [
      ...asA.map((row) => row.walletB),
      ...asB.map((row) => row.walletA),
    ];

    return Array.from(new Set(friends));
  },
});
