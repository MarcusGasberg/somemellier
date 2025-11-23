import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { channels } from "@/db/schema/channels-schema";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/channels")({
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

					const allChannels = await db.select().from(channels);
					return new Response(JSON.stringify({ channels: allChannels }), {
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error fetching channels:", error);
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
