import { Plus } from "lucide-react";
import { ChannelIcon } from "./channel-icon";
import { Button } from "./ui/button";
import { ChannelPostsGrid } from "./channel-posts-grid";
import type { UserChannel } from "@/data/user-channels";
import type { Post } from "@/db/schema/posts-schema";

interface DashboardDate {
	full: Date;
	dayName: string;
	dayNum: number;
	month: string;
	iso: string;
}

interface ChannelsTimelineProps {
	userChannels: UserChannel[];
	campaignId: string | undefined;
	dates: DashboardDate[];
	showDrafts: boolean;
	onEditPost: (post: Post) => void;
	onConnectChannel: () => void;
	t: (...args: any[]) => string;
}

export const ChannelsTimeline = ({
	userChannels,
	dates,
	showDrafts,
	campaignId,
	onEditPost,
	onConnectChannel,
	t,
}: ChannelsTimelineProps) => {
	return (
		<div className="flex flex-col min-w-max">
			{userChannels.length === 0 ? (
				<div className="flex-1 flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-4">
						<div className="text-6xl">📺</div>
						<h3 className="text-xl font-semibold text-foreground">
							{t("channels.empty.title")}
						</h3>
						<p className="text-muted-foreground max-w-md">
							{t("channels.empty.description")}
						</p>
						<Button onClick={onConnectChannel} className="mt-4">
							<Plus className="w-4 h-4 mr-2" />
							{t("channels.empty.connectButton")}
						</Button>
					</div>
				</div>
			) : (
				userChannels.map((channel) => (
					<div
						key={channel.id}
						className="flex border-b border-border min-h-[180px]"
					>
						{/* Channel Column (Sticky Left) */}
						<div className="sticky left-0 w-48 shrink-0 bg-card border-r border-border p-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
							<div className="flex items-center gap-3 mb-2">
								<div className="p-2 bg-secondary/40 rounded-lg border border-border">
									<ChannelIcon iconKey={channel.iconKey} />
								</div>
								<span className="font-semibold text-foreground">
									{channel.name}
								</span>
								{channel.accountId && (
									<span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
										@{channel.accountId}
									</span>
								)}
							</div>
							<div className="text-xs text-muted-foreground pl-1">
								{t("channels.postsScheduled")}
							</div>
						</div>

						{/* Timeline Grid */}
						<ChannelPostsGrid
							channelId={channel.id}
							campaignId={campaignId}
							dates={dates}
							showDrafts={showDrafts}
							onEditPost={onEditPost}
							t={t}
						/>
					</div>
				))
			)}
			{/* Add Channel Button */}
			{userChannels.length !== 0 && (
				<div className="flex border-b border-border min-h-[180px]">
					{/* Channel Column (Sticky Left) */}
					<div className="sticky left-0 w-48 shrink-0 bg-card border-r border-border p-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
						<button
							type="button"
							onClick={onConnectChannel}
							className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2 w-full h-full hover:text-primary hover:bg-primary/10 transition-colors duration-300 rounded-md"
						>
							<Plus className="w-8 h-8" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
