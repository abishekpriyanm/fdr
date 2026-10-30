import "server-only";

/** Fixed prototype settings. These are demonstration controls, not AICTE rules. */
export const DEMO_POLICY = Object.freeze({
  version: "DEMO-FDR-1",
  currency: "INR",
  timeZone: "Asia/Kolkata",
  approachingMaturityWindowDays: 30,
  maxPdfBytes: 10 * 1024 * 1024,
  verificationMode: "SIMULATED",
} as const);
