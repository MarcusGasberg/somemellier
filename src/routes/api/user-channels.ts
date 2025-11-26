import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import {
	channels,
	userChannels,
	userChannelsInsertSchema,
} from "@/db/schema/channels-schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export const Route = createFileRoute("/api/user-channels")({
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

					// Get user's connected channels with channel details
					const userConnectedChannels = await db
						.select({
							id: channels.id,
							name: channels.name,
							type: channels.type,
							iconKey: channels.iconKey,
							config: channels.config,
							metadata: channels.metadata,
							createdAt: channels.createdAt,
							updatedAt: channels.updatedAt,
							userChannelId: userChannels.id,
							accountId: userChannels.accountId,
							credentials: userChannels.credentials,
							settings: userChannels.settings,
							isActive: userChannels.isActive,
						})
						.from(userChannels)
						.innerJoin(channels, eq(userChannels.channelId, channels.id))
						.where(eq(userChannels.userId, session.user.id));

					return new Response(JSON.stringify(userConnectedChannels), {
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error fetching user channels:", error);
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

					const body = userChannelsInsertSchema.parse(await request.json());

					// Check if channel exists
					const channel = await db
						.select()
						.from(channels)
						.where(eq(channels.id, body.channelId))
						.limit(1);

					if (channel.length === 0) {
						return new Response(
							JSON.stringify({ error: "Channel not found" }),
							{
								status: 404,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Check if user channel already exists
					const existingUserChannel = await db
						.select()
						.from(userChannels)
						.where(
							and(
								eq(userChannels.userId, session.user.id),
								eq(userChannels.channelId, body.channelId),
							),
						)
						.limit(1);

					if (existingUserChannel.length > 0) {
						return new Response(
							JSON.stringify({ error: "Channel already connected" }),
							{
								status: 409,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Create user channel connection
					const newUserChannel = await db
						.insert(userChannels)
						.values({
							id: crypto.randomUUID(),
							userId: session.user.id,
							channelId: body.channelId,
							accountId: body.accountId,
							iconKey: channel[0].iconKey,
							isActive: true,
						})
						.returning();

					return new Response(JSON.stringify(newUserChannel[0]), {
						status: 201,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error creating user channel:", error);
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
