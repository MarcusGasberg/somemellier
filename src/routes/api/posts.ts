import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { posts } from "@/db/schema/posts-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

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

					const userPosts = await db
						.select()
						.from(posts)
						.where(eq(posts.userId, session.user.id));
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
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const body: Record<string, any> = await request.json();
					const newPost = await db
						.insert(posts)
						.values({
							...body,
							userId: session.user.id,
							id: crypto.randomUUID(),
						} as any)
						.returning();

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
		},
	},
});
