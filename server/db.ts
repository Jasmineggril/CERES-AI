import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL || "";
  // Skip Supabase URLs that are unreachable from this environment
  if (url.includes("supabase.co")) {
    const host = process.env.PGHOST || "localhost";
    const port = process.env.PGPORT || "5432";
    const user = process.env.PGUSER || "postgres";
    const password = process.env.PGPASSWORD || "";
    const database = process.env.PGDATABASE || "postgres";
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  }
  if (url.includes("://")) return url;
  const host = process.env.PGHOST || "localhost";
  const port = process.env.PGPORT || "5432";
  const user = process.env.PGUSER || "postgres";
  const password = process.env.PGPASSWORD || "";
  const database = process.env.PGDATABASE || "postgres";
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
};

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
