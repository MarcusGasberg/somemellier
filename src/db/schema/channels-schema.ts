import {
	pgTable,
	text,
	jsonb,
	timestamp,
	pgEnum,
	boolean,
} from "drizzle-orm/pg-core";

import { z } from "zod";
import { user } from "./auth-schema";

export const channelTypeEnum = pgEnum("channel_type", [
	"x",
	"instagram",
	"linkedin",
	"tiktok",
	"facebook",
	"youtube",
]);

export const channels = pgTable("channels", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	type: channelTypeEnum("type").notNull(),
	iconKey: text("icon_key").notNull(),
	config: jsonb("config").$type<Record<string, any>>().default({}),
	metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const userChannels = pgTable("user_channels", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	channelId: text("channel_id")
		.notNull()
		.references(() => channels.id, { onDelete: "cascade" }),
	accountId: text("account_id"),
	iconKey: text("icon_key").notNull(),
	credentials: jsonb("credentials").$type<Record<string, any>>().default({}),
	settings: jsonb("settings").$type<Record<string, any>>().default({}),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Zod schemas
export const channelTypeSchema = z.enum([
	"x",
	"instagram",
	"linkedin",
	"tiktok",
	"facebook",
	"youtube",
]);
