import { QueryClient } from "@tanstack/query-core";
import { createCollection, eq } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/react-db";
import { Post } from "@/db/schema/posts-schema";

const queryClient = new QueryClient();

export const postCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["posts"],
		queryFn: async (): Promise<Post[]> => {
			const response = await fetch("/api/posts");
			if (!response.ok) {
				throw new Error("Failed to fetch posts");
			}
			const data = (await response.json()) as { posts: Post[] };
			return data.posts;
		},
		queryClient,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((mutation) =>
					fetch("/api/posts", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(mutation),
					}),
				),
			);
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
