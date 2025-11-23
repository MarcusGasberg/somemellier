import { QueryClient } from "@tanstack/query-core";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { eq, isUndefined } from "@tanstack/db";

import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { userChannelsSelectSchema } from "@/db/schema/channels-schema";
import { channelCollection } from "./use-channels";

const queryClient = new QueryClient();

export const userChannelCollection = createCollection(
	queryCollectionOptions({
		schema: userChannelsSelectSchema,
		queryKey: ["user-channels"],
		queryFn: async () => {
			const res = await fetch("/api/user-channels");
			if (!res.ok) {
				return [];
			}

			const objs = (await res.json()) as any;
			console.log(objs);
			return objs;
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
//
export const useAvailableChannels = () => {
	return useLiveQuery((q) =>
		q
			.from({ channels: channelCollection })
			.leftJoin(
				{ userChannels: userChannelCollection },
				({ channels, userChannels }) => eq(channels.id, userChannels.type),
			)
			.where(({ userChannels }) => isUndefined(userChannels))
			.select(({ channels }) => ({ ...channels })),
	);
};
