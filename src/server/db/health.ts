import "server-only";

import pg from "pg";
import { databaseUrl } from "../env";

export type DatabaseHealth =
  | { connected: true; message: string }
  | { connected: false; message: string };

/** Read-only bootstrap probe. Business persistence and Prisma arrive in Phase 1. */
export async function checkDatabase(): Promise<DatabaseHealth> {
  let client: pg.Client | undefined;
  try {
    client = new pg.Client({
      connectionString: databaseUrl(),
      connectionTimeoutMillis: 3000,
      query_timeout: 3000,
      statement_timeout: 3000,
      application_name: "fdr-demo-health",
    });
    // The driver may emit errors while an idle connection is closed by the server.
    client.on("error", () => {});
    await client.connect();
    await client.query("SELECT 1");
    return { connected: true, message: "Local database connected" };
  } catch {
    // Driver errors can contain usernames/hosts. Never return them to the browser.
    return {
      connected: false,
      message: "Database unavailable. Check .env.local and run npm run db:up.",
    };
  } finally {
    await client?.end().catch(() => undefined);
  }
}
