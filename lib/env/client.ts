import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z
    .string()
    .url("NEXT_PUBLIC_CONVEX_URL must be a valid URL"),

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});
