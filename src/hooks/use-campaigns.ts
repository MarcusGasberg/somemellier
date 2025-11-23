import { QueryClient } from "@tanstack/query-core";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { eq } from "@tanstack/db";

import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { campaignsSelectSchema } from "@/db/schema/campaigns-schema";

const queryClient = new QueryClient();

export const campaignCollection = createCollection(
	queryCollectionOptions({
		schema: campaignsSelectSchema,
		queryKey: ["campaigns"],
		queryFn: async () => {
			const res = await fetch("/api/campaigns");
			if (!res.ok) {
				return [];
			}

			const objs = (await res.json()) as any;
			return objs.campaigns || [];
		},
		queryClient,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((mutation) =>
					fetch("/api/campaigns", {
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

export const useCampaigns = () => {
	return useLiveQuery((q) => q.from({ collection: campaignCollection }));
};

export const useCurrentCampaign = () => {
	// For now, return the first campaign or null
	// In a real implementation, this would be stored in localStorage or a global state
	return useLiveQuery((q) =>
		q
			.from({ collection: campaignCollection })
			.where(({ collection }) => eq(collection.isDefault, true))
			.orderBy(({ collection }) => collection.createdAt, "desc")
			.limit(1),
	);
};
