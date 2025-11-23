import {
	pgTable,
	text,
	jsonb,
	timestamp,
	integer,
	pgEnum,
} from "drizzle-orm/pg-core";
import {
	createSelectSchema,
	createInsertSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
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

// Zod schemas
export const postsSelectSchema = createSelectSchema(posts);
export const postsInsertSchema = createInsertSchema(posts);
export const postsUpdateSchema = createUpdateSchema(posts);

export const postVersionsSelectSchema = createSelectSchema(postVersions);
export const postVersionsInsertSchema = createInsertSchema(postVersions);
export const postVersionsUpdateSchema = createUpdateSchema(postVersions);

// Types
export type Post = z.infer<typeof postsSelectSchema>;
export type NewPost = z.infer<typeof postsInsertSchema>;
export type UpdatePost = z.infer<typeof postsUpdateSchema>;

export type PostVersion = z.infer<typeof postVersionsSelectSchema>;
export type NewPostVersion = z.infer<typeof postVersionsInsertSchema>;
export type UpdatePostVersion = z.infer<typeof postVersionsUpdateSchema>;
