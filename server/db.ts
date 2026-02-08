// Lightweight DB shim: if a real DB is configured, the app will use it.
// For local dev without Postgres, we export `db = undefined` and the
// storage layer will fall back to an in-memory implementation.

import * as schema from "@shared/schema";

export const db: any = undefined;
export const pool: any = undefined;
