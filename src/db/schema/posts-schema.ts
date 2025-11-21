import {
	pgTable,
	text,
	jsonb,
	timestamp,
	integer,
	pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { channels } from "./channels-schema";

export const postStatusEnum = pgEnum("post_status", [
	"draft",
	"scheduled",
	"published",
	"failed",
]);

export const posts = pgTable("posts", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	channelId: text("channel_id")
		.notNull()
		.references(() => channels.id, { onDelete: "cascade" }),
	title: text("title"),
	content: text("content").notNull(),
	status: postStatusEnum("status").default("draft").notNull(),
	postType: text("post_type").notNull(),
	scheduledAt: timestamp("scheduled_at"),
	publishedAt: timestamp("published_at"),
	metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
	mediaAttachments: jsonb("media_attachments")
		.$type<Array<Record<string, any>>>()
		.default([]),
	analytics: jsonb("analytics").$type<Record<string, any>>().default({}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const postVersions = pgTable("post_versions", {
	id: text("id").primaryKey(),
	postId: text("post_id")
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
	version: integer("version").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
