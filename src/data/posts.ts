import { db } from "@/db";
import {
	posts,
	postsInsertSchema,
	postsUpdateSchema,
} from "@/db/schema/posts-schema";
import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";

import { z } from "zod";

export const getPosts = createServerFn()
	.inputValidator(
		z.object({
			campaignId: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const request = getRequest();
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		if (!session?.user?.id) {
			return [];
		}

		const campaignId = data.campaignId;

		const userPosts = await db
			.select()
			.from(posts)
			.where(
				campaignId
					? and(
							eq(posts.userId, session.user.id),
							eq(posts.campaignId, campaignId),
						)
					: eq(posts.userId, session.user.id),
			);
		return userPosts;
	});

export const createPost = createServerFn({
	method: "POST",
})
	.inputValidator(postsInsertSchema)
	.handler(async ({ data }) => {
		const request = getRequest();
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}
		const newPost = await db.insert(posts).values(data).returning();

		return newPost[0];
	});

export const updatePost = createServerFn({
	method: "POST",
})
	.inputValidator((x) => {
		return postsUpdateSchema.parse(x);
	})
	.handler(async ({ data }) => {
		const request = getRequest();
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}
		const { id, ...updateData } = data;

		const updatedPost = await db
			.update(posts)
			.set(updateData)
			.where(eq(posts.id, id))
			.returning();

		return updatedPost[0];
	});

export type Post = Awaited<ReturnType<typeof getPosts>>[number];
