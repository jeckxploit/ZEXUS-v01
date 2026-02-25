#!/usr/bin/env bun

/**
 * Generate a secure random secret for NextAuth
 * Usage: bun run scripts:generate-secret
 */

// Use Node.js crypto module for Bun
const crypto = await import("node:crypto");
const secret = crypto.default.randomBytes(32).toString("base64");
console.log("\n🔐 Your NEXTAUTH_SECRET:\n");
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log("\n📋 Copy this to your .env.local file\n");
