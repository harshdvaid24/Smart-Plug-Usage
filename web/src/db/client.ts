import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { DDL } from "./ddl";
import * as schema from "./schema";

/**
 * SQLite connection (shared file with the poller). The web app READS; the poller
 * WRITES. We open in WAL mode so concurrent read/write is safe.
 */

/** Resolve DATABASE_URL (default ./data/energy.db at repo root). */
export function resolveDbPath(): string {
  const raw = process.env.DATABASE_URL ?? "../data/energy.db";
  return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

function applyDdl(db: Database.Database): void {
  db.exec(DDL); // idempotent
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _sqlite: Database.Database | null = null;

export function getSqlite(): Database.Database {
  if (_sqlite) return _sqlite;
  const path = resolveDbPath();
  mkdirSync(dirname(path), { recursive: true });
  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("busy_timeout = 5000");
  applyDdl(sqlite); // idempotent — web is self-sufficient even before poller runs
  _sqlite = sqlite;
  return sqlite;
}

export function getDb() {
  if (_db) return _db;
  _db = drizzle(getSqlite(), { schema });
  return _db;
}

export { schema };
