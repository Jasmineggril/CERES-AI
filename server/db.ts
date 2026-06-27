import fs from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const loadDotenv = () => {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const [key, ...valueParts] = line.split("=");
    if (!key || valueParts.length === 0) continue;

    const rawValue = valueParts.join("=").trim();
    const value = rawValue.replace(/^"|"$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

const getDatabaseUrl = (): string => {
  loadDotenv();

  const url = process.env.DATABASE_URL?.trim() || "";
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

const poolConfig: pg.PoolConfig & { family?: number } = {
  connectionString: databaseUrl,
};

if (databaseUrl.includes("supabase.co") || process.env.PGSSLMODE === "require") {
  poolConfig.ssl = { rejectUnauthorized: false };
  poolConfig.family = 4;
}

export const pool = new Pool(poolConfig);
export const db = drizzle(pool, { schema });
