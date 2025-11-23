import { QueryClient } from "@tanstack/query-core";
import { createCollection, useLiveQuery, eq } from "@tanstack/react-db";

import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { type Channel, channelTypeSchema } from "@/db/schema/channels-schema";
import { channelCollection } from "./use-channels";
import { z } from "zod";

const queryClient = new QueryClient();

export const userChannelsWithChannelSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: channelTypeSchema,
	iconKey: z.string(),
	config: z.record(z.string(), z.any()).optional(),
	metadata: z.record(z.string(), z.any()).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userChannelId: z.string(),
	accountId: z.string().nullable(),
	credentials: z.record(z.string(), z.any()).optional(),
	settings: z.record(z.string(), z.any()).optional(),
	isActive: z.boolean(),
});

export const userChannelCollection = createCollection(
	queryCollectionOptions({
		schema: userChannelsWithChannelSchema,
		queryKey: ["user-channels"],
		queryFn: async () => {
			const res = (await fetch("/api/user-channels")).json() as any;
			return res;
		},
		queryClient,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((mutation) =>
					fetch("/api/user-channels", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(mutation.modified),
					}),
				),
			);
		},
	}),
);

export type UserChannelWithChannel = z.infer<
	typeof userChannelsWithChannelSchema
>;

export interface UserChannel extends Channel {
	userChannelId: string;
	accountId: string | null;
	credentials?: Record<string, any>;
	settings?: Record<string, any>;
	isActive: boolean;
}

export const useUserChannels = () => {
	return useLiveQuery((q) => q.from({ collection: userChannelCollection }));
};

//
// export const useConnectChannel = () => {
// 	const queryClient = useQueryClient();
//
// 	return useMutation({
// 		mutationFn: async (channelData: {
// 			channelId: string;
// 			accountId?: string;
// 		}) => {
// 			const response = await fetch("/api/user-channels", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(channelData),
// 			});
// 			if (!response.ok) {
// 				const errorData: { error: string } = await response.json();
// 				throw new Error(errorData.error || "Failed to connect channel");
// 			}
// 			const data = (await response.json()) as { userChannel: any };
// 			return data;
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["user-channels"] });
// 		},
// 	});
// };
//
export const useAvailableChannels = () => {
	return useLiveQuery((q) =>
		q
			.from({
				allChannels: channelCollection,
			})
			.leftJoin(
				{ userChannels: userChannelCollection },
				({ allChannels, userChannels }) => eq(allChannels.id, userChannels.id),
			)
			.select((q) => q.allChannels),
	);
};
