import { config } from "dotenv";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
import { must } from "@/lib/must.ts";

config();

const connectionString = must(
	process.env.DATABASE_URL,
	"DATABASE_URL must be set",
);

const sql = neon(connectionString);
export const db = drizzle({ client: sql, schema });
