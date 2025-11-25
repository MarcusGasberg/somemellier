import { QueryClient } from "@tanstack/query-core";
import {
	createCollection,
	eq,
	parseLoadSubsetOptions,
} from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/react-db";
import type { Post } from "@/db/schema/posts-schema";
import { createPost, getPosts, updatePost } from "@/data/posts";

const queryClient = new QueryClient();

export const postCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["posts"],
		queryFn: async (ctx): Promise<Post[]> => {
			const where = ctx.meta?.loadSubsetOptions.where;
			const parsed = parseLoadSubsetOptions({ where });
			const params = new URLSearchParams();
			parsed.filters.forEach(({ field, operator, value }) => {
				const fieldName = field.join(".");
				if (operator === "eq") {
					params.set(fieldName, String(value));
				} else if (operator === "lt") {
					params.set(`${fieldName}_lt`, String(value));
				} else if (operator === "gt") {
					params.set(`${fieldName}_gt`, String(value));
				}
			});

			const campaignId = params.get("campaignId");
			const posts = await getPosts({
				data: campaignId ? { campaignId } : {},
			});

			return posts;
		},
		queryClient,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			try {
				await Promise.all(
					transaction.mutations.map((mutation) =>
						createPost({
							data: mutation.modified,
						}),
					),
				);
			} catch (e) {
				console.error(e);
			}
		},
		onUpdate: async ({ transaction }) => {
			try {
				await Promise.all(
					transaction.mutations.map((mutation) =>
						updatePost({
							data: mutation.modified,
						}),
					),
				);
			} catch (e) {
				console.error(e);
			}
		},
	}),
);

export const usePosts = (channelId?: string, campaignId?: string) => {
	return useLiveQuery((q) => {
		let query = q.from({ posts: postCollection });

		if (channelId) {
			query = query.where((q) => eq(q.posts.channelId, channelId));
		}

		if (campaignId) {
			query = query.where((q) => eq(q.posts.campaignId, campaignId));
		}

		return query;
	});
};

// export const useCreatePost = () => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (
// 			postData: Omit<NewPost, "id" | "userId">,
// 		): Promise<Post> => {
// 			const response = await fetch("/api/posts", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(postData),
// 			});
// 			if (!response.ok) {
// 				throw new Error("Failed to create post");
// 			}
// 			const data = (await response.json()) as { post: Post };
// 			return data.post;
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["posts"] });
// 		},
// 	});
// };
