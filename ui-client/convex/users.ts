import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeWallet } from "./lib";
import { requireSiweSession } from "./lib/siweSession";

export const upsertPublicKey = mutation({
  args: {
    sessionToken: v.string(),
    walletAddress: v.string(),
    publicKey: v.string(),
  },
  handler: async (ctx, args) => {
    const walletAddress = await requireSiweSession(
      ctx,
      args.sessionToken,
      args.walletAddress
    );
    const publicKey = args.publicKey.trim();
    if (!publicKey) {
      throw new Error("publicKey is required");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        publicKey,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      walletAddress,
      publicKey,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    return await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();
  },
});

export const getPublicKeysByWallets = query({
  args: { walletAddresses: v.array(v.string()) },
  handler: async (ctx, args) => {
    const unique = Array.from(
      new Set(args.walletAddresses.map(normalizeWallet).filter(Boolean))
    );

    const rows = await Promise.all(
      unique.map(async (walletAddress) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
          .unique();
        return user
          ? { walletAddress, publicKey: user.publicKey }
          : { walletAddress, publicKey: null };
      })
    );

    return rows;
  },
});
