// instrumentation.ts (project root, or in src/ if you use one)
export async function register() {
  // Runs once when the Node.js server starts, so a bad config stops the
  // app immediately instead of failing on the first request.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./lib/env");
  }
}
