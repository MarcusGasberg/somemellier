import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "cloudflare:workers";

config({
  path: ".env.local",
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL || process.env.DATABASE_URL!,
  },
});
