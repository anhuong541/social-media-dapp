import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { normalizeWallet } from "./lib";
import {
  generateNonce,
  generateSessionToken,
  hashSessionToken,
  requireSiweSession,
} from "./lib/siweSession";

const SIWE_NONCE_TTL_MS = 1000 * 60 * 10;
const SIWE_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const issueNonce = mutation({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    if (!walletAddress) {
      throw new Error("walletAddress is required");
    }

    const existing = await ctx.db
      .query("siweNonces")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();

    const nonce = generateNonce();
    const expiresAt = Date.now() + SIWE_NONCE_TTL_MS;

    if (existing) {
      await ctx.db.patch(existing._id, { nonce, expiresAt });
    } else {
      await ctx.db.insert("siweNonces", {
        walletAddress,
        nonce,
        expiresAt,
      });
    }

    return { nonce, expiresAt };
  },
});

/** Only callable from `authActions.verifyLogin` after signature checks. */
export const createSession = internalMutation({
  args: {
    walletAddress: v.string(),
    nonce: v.string(),
  },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const row = await ctx.db
      .query("siweNonces")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();

    if (!row || row.nonce !== args.nonce) {
      throw new Error("Invalid or missing SIWE nonce");
    }
    if (row.expiresAt < Date.now()) {
      throw new Error("SIWE nonce expired");
    }

    await ctx.db.delete(row._id);

    const oldSessions = await ctx.db
      .query("sessions")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .collect();
    for (const session of oldSessions) {
      await ctx.db.delete(session._id);
    }

    const token = generateSessionToken();
    const now = Date.now();
    await ctx.db.insert("sessions", {
      walletAddress,
      tokenHash: await hashSessionToken(token),
      createdAt: now,
      expiresAt: now + SIWE_SESSION_TTL_MS,
    });

    return {
      sessionToken: token,
      expiresAt: now + SIWE_SESSION_TTL_MS,
    };
  },
});

export const logout = mutation({
  args: {
    sessionToken: v.string(),
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const tokenHash = await hashSessionToken(args.sessionToken);
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .unique();
    if (session && session.walletAddress === walletAddress) {
      await ctx.db.delete(session._id);
    }
    return true;
  },
});

export const getSession = query({
  args: {
    sessionToken: v.string(),
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const wallet = await requireSiweSession(
        ctx,
        args.sessionToken,
        args.walletAddress
      );
      return { valid: true as const, walletAddress: wallet };
    } catch {
      return { valid: false as const, walletAddress: null };
    }
  },
});
