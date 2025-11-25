import { db } from "@/db";
import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { channels, userChannels } from "@/db/schema/channels-schema";
import { eq } from "drizzle-orm";

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

export type UserChannel = Awaited<ReturnType<typeof getUserChannels>>[number];
