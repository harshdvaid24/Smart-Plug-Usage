import { getSqlite, resolveDbPath } from "./client";

/** Apply the canonical DDL (idempotent). Run: `npm run db:migrate`. */
function main() {
  const path = resolveDbPath();
  getSqlite(); // opens + applies DDL
  console.log(`[migrate] schema ensured at ${path}`);
}

main();
