import "server-only";

export function databaseUrl(): string {
  if (process.env.DEMO_MODE !== "true") {
    throw new Error("Enable DEMO_MODE=true for the local synthetic demo.");
  }
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("Configure DATABASE_URL in .env.local.");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("DATABASE_URL must use PostgreSQL.");
  }
  return value;
}
