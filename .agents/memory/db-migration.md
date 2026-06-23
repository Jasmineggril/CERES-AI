---
name: DB Migration Command
description: How to run drizzle-kit push against the local Replit PostgreSQL
---

`npx drizzle-kit push` fails when `DATABASE_URL` points to a Supabase URL (`supabase.co`), which is unreachable from the Replit sandbox.

**Why:** The drizzle.config.ts reads `DATABASE_URL` directly, but `server/db.ts` has a fallback that detects supabase URLs and uses local `PG*` env vars instead. drizzle-kit doesn't have this fallback.

**How to apply:** Always run migrations with the local PG vars explicitly:
```
DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}" npx drizzle-kit push --config=drizzle.config.ts
```
