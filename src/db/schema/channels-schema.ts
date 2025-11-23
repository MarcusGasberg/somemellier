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

export const channelsSelectSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: channelTypeSchema,
	iconKey: z.string(),
	config: z.record(z.string(), z.any()).optional(),
	metadata: z.record(z.string(), z.any()).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const channelsUpdateSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	type: channelTypeSchema.optional(),
	iconKey: z.string().optional(),
	config: z.record(z.string(), z.any()).optional(),
	metadata: z.record(z.string(), z.any()).optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const userChannelsSelectSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	type: channelTypeSchema,
	channelId: z.string(),
	accountId: z.string().nullable(),
	credentials: z.record(z.string(), z.any()).optional(),
	settings: z.record(z.string(), z.any()).optional(),
	iconKey: z.string(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const userChannelsInsertSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string().optional(),
	type: channelTypeSchema,
	channelId: z.string(),
	accountId: z.string().nullable(),
	iconKey: z.string(),
	credentials: z.record(z.string(), z.any()).optional(),
	settings: z.record(z.string(), z.any()).optional(),
	isActive: z.boolean().optional(),
});

export const userChannelsUpdateSchema = z.object({
	id: z.string().optional(),
	userId: z.string().optional(),
	name: z.string().optional(),
	type: channelTypeSchema.optional(),
	channelId: z.string().optional(),
	accountId: z.string().nullable().optional(),
	credentials: z.record(z.string(), z.any()).optional(),
	settings: z.record(z.string(), z.any()).optional(),
	iconKey: z.string().optional(),
	isActive: z.boolean().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

// Types
export type Channel = z.infer<typeof channelsSelectSchema>;
export type UpdateChannel = z.infer<typeof channelsUpdateSchema>;

export type UserChannel = z.infer<typeof userChannelsSelectSchema>;
export type NewUserChannel = z.infer<typeof userChannelsInsertSchema>;
export type UpdateUserChannel = z.infer<typeof userChannelsUpdateSchema>;
