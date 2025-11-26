import { db } from "@/db";
import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import {
	channels,
	userChannels,
	userChannelsInsertSchema,
} from "@/db/schema/channels-schema";
import { and, eq } from "drizzle-orm";

export const getUserChannels = createServerFn().handler(async () => {
	const request = getRequest();

	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session?.user?.id) {
		return [];
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

	return userConnectedChannels;
});

export const createUserChannel = createServerFn()
	.inputValidator(userChannelsInsertSchema)
	.handler(async ({ data }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Check if channel exists
		const channel = await db
			.select()
			.from(channels)
			.where(eq(channels.id, data.channelId))
			.limit(1);

		if (channel.length === 0) {
			throw new Error("Channel not found");
		}

		// Check if user channel already exists
		const existingUserChannel = await db
			.select()
			.from(userChannels)
			.where(
				and(
					eq(userChannels.userId, session.user.id),
					eq(userChannels.channelId, data.channelId),
				),
			)
			.limit(1);

		if (existingUserChannel.length > 0) {
			throw new Error("User channel already exists");
		}

		// Create user channel connection
		const newUserChannel = await db
			.insert(userChannels)
			.values({
				id: crypto.randomUUID(),
				userId: session.user.id,
				channelId: data.channelId,
				accountId: data.accountId,
				iconKey: channel[0].iconKey,
				isActive: true,
			})
			.returning();

		return newUserChannel[0];
	});

export type UserChannel = Awaited<ReturnType<typeof getUserChannels>>[number];
