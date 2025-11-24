import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import {
	posts,
	postsInsertSchema,
	postsUpdateSchema,
} from "@/db/schema/posts-schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export const Route = createFileRoute("/api/posts")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const url = new URL(request.url);
					const campaignId = url.searchParams.get("campaignId");

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
					return new Response(JSON.stringify({ posts: userPosts }), {
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error fetching posts:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
			POST: async ({ request }) => {
				try {
					console.error("GOT REQUEST", request);
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const body = postsInsertSchema.parse(await request.json());

					const newPost = await db.insert(posts).values(body).returning();

					return new Response(JSON.stringify({ post: newPost[0] }), {
						status: 201,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error creating post:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
			PUT: async ({ request }) => {
				try {
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const body = postsUpdateSchema.parse(await request.json());

					if (!body.id) {
						return new Response(JSON.stringify({ error: "Post ID required" }), {
							status: 400,
							headers: { "Content-Type": "application/json" },
						});
					}

					// Verify ownership
					const existingPost = await db
						.select()
						.from(posts)
						.where(
							and(eq(posts.id, body.id), eq(posts.userId, session.user.id)),
						)
						.limit(1);

					if (existingPost.length === 0) {
						return new Response(
							JSON.stringify({ error: "Post not found or unauthorized" }),
							{
								status: 404,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const updatedPost = await db
						.update(posts)
						.set({ ...body, updatedAt: new Date() })
						.where(eq(posts.id, body.id))
						.returning();

					return new Response(JSON.stringify({ post: updatedPost[0] }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error updating post:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
