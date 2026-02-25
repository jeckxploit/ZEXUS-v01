import { z } from "zod";

// Define environment schema
const envSchema = z.object({
  // Required
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  ZAI_API_KEY: z.string().min(1, "ZAI_API_KEY is required"),
  
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
