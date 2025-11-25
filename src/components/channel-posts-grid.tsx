import { Plus } from "lucide-react";
import { PostCard } from "./post-card";
import type { Post } from "@/db/schema/posts-schema";
import { isSameDay } from "date-fns";
import { usePosts } from "@/hooks/use-posts";

interface DashboardDate {
	full: Date;
	dayName: string;
	dayNum: number;
	month: string;
	iso: string;
}

interface ChannelPostsGridProps {
	channelId: string;
	campaignId: string | undefined;
	dates: DashboardDate[];
	showDrafts: boolean;
	onEditPost: (post: Post) => void;
	t: (key: string) => string;
}

export const ChannelPostsGrid = ({
	channelId,
	campaignId,
	dates,
	showDrafts,
	onEditPost,
	t,
}: ChannelPostsGridProps) => {
	const { data: posts = [] } = usePosts(channelId, campaignId);
	return (
		<div
			className="flex"
			style={{
				width: `${dates.length * 200 + (showDrafts ? 200 : 0)}px`,
			}}
		>
			{showDrafts && (
				<div className="w-[200px] shrink-0 p-3 border-r border-border relative group transition-colors bg-secondary/5">
					<button
						type="button"
						className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
					>
						<Plus size={16} />
					</button>

					<div className="space-y-2">
						{posts
							.filter((p) => p.status === "draft")
							.map((post) => (
								<div key={post.id} className="relative group/card">
									<PostCard
										post={{ ...post, type: post.postType }}
										onEdit={() => onEditPost(post)}
									/>
								</div>
							))}
					</div>

					{posts.filter((p) => p.status === "draft").length === 0 && (
						<div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
							<div className="text-muted-foreground text-xs border border-dashed border-border px-3 py-1 rounded-full">
								{t("timeline.emptySlot")}
							</div>
						</div>
					)}
				</div>
			)}
			{dates.map((date) => {
				const dayPosts = posts.filter(
					(p) => p.scheduledAt && isSameDay(date.full, p.scheduledAt),
				);
				const isToday = new Date().getDate() === date.dayNum;

				return (
					<div
						key={`${channelId}-${date.iso}`}
						className={`w-[200px] shrink-0 p-3 border-r border-border relative group transition-colors hover:bg-secondary/10 ${isToday ? "bg-primary/5 hover:bg-secondary/30" : ""}`}
					>
						{/* Add Button (Hidden until hover) */}
						<button
							type="button"
							className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
						>
							<Plus size={16} />
						</button>

						{/* Posts */}
						<div className="space-y-2">
							{dayPosts.map((post) => (
								<div key={post.id} className="relative group/card">
									<PostCard
										post={{ ...post, type: post.postType }}
										onEdit={() => onEditPost(post)}
									/>
								</div>
							))}
						</div>

						{/* Empty State Placeholder */}
						{dayPosts.length === 0 && (
							<div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
								<div className="text-muted-foreground text-xs border border-dashed border-border px-3 py-1 rounded-full">
									{t("timeline.emptySlot")}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
