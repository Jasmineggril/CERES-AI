import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Construct DATABASE_URL from individual PG* environment variables if needed
const getDatabaseUrl = (): string => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("://")) {
    return process.env.DATABASE_URL;
  }
  
  // Fall back to constructing from individual variables
  const host = process.env.PGHOST || "localhost";
  const port = process.env.PGPORT || "5432";
  const user = process.env.PGUSER || "postgres";
  const password = process.env.PGPASSWORD || "password";
  const database = process.env.PGDATABASE || "postgres";
  
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
