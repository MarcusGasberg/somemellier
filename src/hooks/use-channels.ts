import { QueryClient } from "@tanstack/query-core";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { Channel } from "@/db/schema/channels-schema";

const queryClient = new QueryClient();

export const channelCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["channels"],
		queryFn: async (): Promise<Channel[]> => {
			const response = await fetch("/api/channels");
			if (!response.ok) {
				throw new Error("Failed to fetch channels");
			}
			const data = (await response.json()) as { channels: Channel[] };
			return data.channels;
		},
		queryClient,
		getKey: (item) => item.id,
	}),
);

export const useChannels = () =>
	useLiveQuery((q) => q.from({ channels: channelCollection }));
