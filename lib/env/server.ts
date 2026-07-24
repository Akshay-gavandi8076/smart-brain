import { z } from "zod";

const serverEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),

  CONVEX_DEPLOYMENT: z.string().min(1),

  CLERK_SECRET_KEY: z.string().min(1),

  CLERK_DOMAIN: z.string().min(1),
});

export const serverEnv = serverEnvSchema.parse(process.env);
