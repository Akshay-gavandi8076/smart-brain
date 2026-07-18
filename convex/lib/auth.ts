import { ConvexError } from "convex/values";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = MutationCtx | QueryCtx | ActionCtx;

export async function getUserId(ctx: AuthCtx): Promise<string | null> {
  return (await ctx.auth.getUserIdentity())?.tokenIdentifier ?? null;
}

export async function requireUserId(ctx: AuthCtx): Promise<string> {
  const userId = await getUserId(ctx);
  if (!userId) throw new ConvexError("Unauthorized");
  return userId;
}
