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
import { campaigns } from "./campaigns-schema";

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
	campaignId: text("campaign_id").references(() => campaigns.id, {
		onDelete: "set null",
	}),
	title: text("title"),
	content: text("content").notNull(),
	status: postStatusEnum("status").default("draft").notNull(),
	postType: text("post_type").notNull(),
	scheduledAt: timestamp("scheduled_at", { mode: "date" }),
	publishedAt: timestamp("published_at", { mode: "date" }),
	metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
	mediaAttachments: jsonb("media_attachments")
		.$type<Array<Record<string, any>>>()
		.default([]),
	analytics: jsonb("analytics").$type<Record<string, any>>().default({}),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" })
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
export const postsInsertSchema = createInsertSchema(posts).extend({
	createdAt: z
		.union([z.date(), z.string()])
		.transform((val) => (typeof val === "string" ? new Date(val) : val)),
	updatedAt: z
		.union([z.date(), z.string()])
		.transform((val) => (typeof val === "string" ? new Date(val) : val)),
	scheduledAt: z
		.union([z.date(), z.string(), z.null()])
		.transform((val) =>
			val === null ? null : typeof val === "string" ? new Date(val) : val,
		),
	publishedAt: z
		.union([z.date(), z.string(), z.null()])
		.transform((val) =>
			val === null ? null : typeof val === "string" ? new Date(val) : val,
		),
});
export const postsUpdateSchema = createUpdateSchema(posts).extend({
	id: z.string(),
	createdAt: z
		.union([z.date(), z.string()])
		.transform((val) => (typeof val === "string" ? new Date(val) : val)),
	updatedAt: z
		.union([z.date(), z.string()])
		.transform((val) => (typeof val === "string" ? new Date(val) : val)),
	scheduledAt: z
		.union([z.date(), z.string(), z.null()])
		.transform((val) =>
			val === null ? null : typeof val === "string" ? new Date(val) : val,
		),
	publishedAt: z
		.union([z.date(), z.string(), z.null()])
		.transform((val) =>
			val === null ? null : typeof val === "string" ? new Date(val) : val,
		),
});
