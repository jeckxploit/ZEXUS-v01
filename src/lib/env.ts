import { z } from "zod";

// Define environment schema
const envSchema = z.object({
  // Optional
  DATABASE_URL: z.string().optional(),
  ZAI_API_KEY: z.string().optional(),

  // Optional - NextAuth
  NEXTAUTH_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  
  // Optional - OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // Optional - Features
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Validate environment
export const env = envSchema.parse(process.env);

// Type export
export type Env = z.infer<typeof envSchema>;
