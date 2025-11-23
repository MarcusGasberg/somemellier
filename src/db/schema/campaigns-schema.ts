import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import {
	createSelectSchema,
	createInsertSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

export const campaigns = pgTable("campaigns", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	isDefault: boolean("is_default").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Zod schemas
export const campaignsSelectSchema = createSelectSchema(campaigns);
export const campaignsInsertSchema = createInsertSchema(campaigns);
export const campaignsUpdateSchema = createUpdateSchema(campaigns);

// Types
export type Campaign = z.infer<typeof campaignsSelectSchema>;
export type NewCampaign = z.infer<typeof campaignsInsertSchema>;
export type UpdateCampaign = z.infer<typeof campaignsUpdateSchema>;
