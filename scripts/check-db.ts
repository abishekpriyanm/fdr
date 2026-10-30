import { checkDatabase } from "../src/server/db/health";

const health = await checkDatabase();
console.log(health.message);
if (!health.connected) process.exitCode = 1;
