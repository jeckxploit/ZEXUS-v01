// This file configures the Sentry SDK for Next.js server-side
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Profiling
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Environment
  environment: process.env.NODE_ENV || "development",
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development",
  
  // Before sending event
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Sentry] Server event would be sent:", event);
      return null;
    }
    return event;
  },
});
