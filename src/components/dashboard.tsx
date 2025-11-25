import {
	BarChart3,
	Calendar,
	FileText,
	Layout,
	MessageSquare,
	Plus,
	Settings,
	Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { AIPanel } from "./ai-panel";
import { ChannelConnectionModal } from "./channel-connection-modal";
import { CampaignSelectorModal } from "./campaign-selector-modal";
import { PostCreationModal } from "./post-creation-modal";
import { ChannelsTimeline } from "./channels-timeline";
import { userChannelCollection } from "@/hooks/use-user-channels";
import { usePosts } from "@/hooks/use-posts";
import { useCurrentCampaign, useCampaigns } from "@/hooks/use-campaigns";
import { useLiveQuery } from "@tanstack/react-db";
import type { Campaign } from "@/db/schema/campaigns-schema";
import type { Post } from "@/db/schema/posts-schema";

interface User {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

interface DashboardProps {
	user?: User;
	onLogout: () => void;
	campaignId?: string;
}

// Channels are now fetched from the API

interface DashboardDate {
	full: Date;
	dayName: string;
	dayNum: number;
	month: string;
	iso: string;
}

const generateDates = (days = 14): DashboardDate[] => {
	const dates = [];
	const today = new Date();
	for (let i = 0; i < days; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() + i);
		dates.push({
			full: date,
			dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
			dayNum: date.getDate(),
			month: date.toLocaleDateString("en-US", { month: "short" }),
			iso: date.toISOString().split("T")[0],
		});
	}
	return dates;
};
// Posts are now fetched from the API

export const Dashboard = ({ user, onLogout, campaignId }: DashboardProps) => {
	const { t } = useTranslation("dashboard");
	const router = useRouter();
	const [dates] = useState<DashboardDate[]>(() => generateDates(21));
	const [isAiModalOpen, setAiModalOpen] = useState(false);
	const [isChannelModalOpen, setChannelModalOpen] = useState(false);
	const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
	const [isPostModalOpen, setPostModalOpen] = useState(false);
	const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
	const [showDrafts, setShowDrafts] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const headerScrollRef = useRef<HTMLDivElement>(null);
	const hasAttemptedDefaultCreation = useRef(false);
	const { data: userChannels } = useLiveQuery((q) =>
		q.from({ userChannels: userChannelCollection }),
	);
	const { data: currentCampaignData, isLoading: isCurrentCampaignLoading } =
		useCurrentCampaign();
	const { data: allCampaigns = [] } = useCampaigns();

	useEffect(() => {
		const bodyScroll = scrollContainerRef.current;
		const headerScroll = headerScrollRef.current;

		if (!bodyScroll || !headerScroll) return;

		const syncScroll = (source: HTMLElement, target: HTMLElement) => {
			target.scrollLeft = source.scrollLeft;
		};

		const handleBodyScroll = () => syncScroll(bodyScroll, headerScroll);
		const handleHeaderScroll = () => syncScroll(headerScroll, bodyScroll);

		bodyScroll.addEventListener("scroll", handleBodyScroll);
		headerScroll.addEventListener("scroll", handleHeaderScroll);

		return () => {
			bodyScroll.removeEventListener("scroll", handleBodyScroll);
			headerScroll.removeEventListener("scroll", handleHeaderScroll);
		};
	}, []);

	useEffect(() => {
		// If campaignId is provided in URL, find and set that campaign
		if (campaignId && allCampaigns.length > 0 && !currentCampaign) {
			const campaignFromUrl = allCampaigns.find((c) => c.id === campaignId);
			if (campaignFromUrl) {
				setCurrentCampaign(campaignFromUrl);
				return;
			}
		}

		// Otherwise, use the default campaign logic
		if (
			currentCampaignData &&
			currentCampaignData.length > 0 &&
			!currentCampaign
		) {
			setCurrentCampaign(currentCampaignData[0]);
		} else if (
			!isCurrentCampaignLoading &&
			currentCampaignData.length === 0 &&
			user?.id &&
			!currentCampaign &&
			!hasAttemptedDefaultCreation.current
		) {
			hasAttemptedDefaultCreation.current = true;
			// Create default campaign for new users
			fetch("/api/campaigns", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "Default",
					description: "Your default campaign",
					isDefault: true,
				}),
			})
				.then((response) => response.json())
				.then((data: any) => {
					setCurrentCampaign(data.campaign);
				})
				.catch((error) => {
					console.error("Failed to create default campaign:", error);
					hasAttemptedDefaultCreation.current = false; // Reset on error to allow retry
				});
		}
	}, [
		campaignId,
		allCampaigns,
		currentCampaignData,
		currentCampaign,
		isCurrentCampaignLoading,
		user?.id,
	]);

	const handleAiGeneration = (
		generatedPosts: { channelId: string; content: string; type: string }[],
	) => {
		// TODO: Implement AI post generation with real API
		console.log("Generated posts:", generatedPosts);
	};

	const handleCampaignSelect = (campaign: Campaign) => {
		setCurrentCampaign(campaign);
		setCampaignModalOpen(false);
		// Update URL with campaign ID
		router.navigate({
			to: "/dashboard",
			search: { campaignId: campaign.id },
			replace: true,
		});
	};

	const handleEditPost = (post: Post) => {
		setEditingPost(post);
		setPostModalOpen(true);
	};

	const handleCreatePost = () => {
		setEditingPost(null);
		setPostModalOpen(true);
	};

	return (
		<div className="flex h-screen bg-background overflow-hidden font-sans">
			{/* Sidebar */}
			<aside className="w-64 bg-card text-muted-foreground flex flex-col flex-shrink-0 transition-all duration-300">
				<div className="h-16 flex items-center px-6 border-b border-border">
					<Sparkles className="text-primary mr-2" size={20} />
					<span className="text-foreground font-bold text-lg">
						{t("brand")}
					</span>
				</div>

				<div className="p-4 space-y-1">
					<div className="text-xs uppercase font-bold text-muted-foreground mb-2 px-2">
						{t("menu.title")}
					</div>
					<button
						type="button"
						className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-primary/10 text-primary rounded-lg border border-primary/20"
					>
						<Layout size={18} /> {t("menu.dashboard")}
					</button>
					<button
						type="button"
						className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary/30 rounded-lg transition-colors"
					>
						<Calendar size={18} /> {t("menu.calendar")}
					</button>
					<button
						type="button"
						className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary/30 rounded-lg transition-colors"
					>
						<MessageSquare size={18} /> {t("menu.mentions")}
					</button>
					<button
						type="button"
						className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary/30 rounded-lg transition-colors"
					>
						<BarChart3 size={18} /> {t("menu.analytics")}
					</button>
				</div>

				<div className="mt-auto p-4 border-t border-border">
					<div className="flex items-center gap-3 px-2 mb-4">
						<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
							{user?.name
								? user.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)
								: "U"}
						</div>
						<div className="flex-1">
							<div className="text-sm text-foreground font-medium">
								{user?.name || "User"}
							</div>
							<div className="text-xs text-muted-foreground">
								{t("user.plan")}
							</div>
						</div>
					</div>
					<button
						type="button"
						onClick={onLogout}
						className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
					>
						{t("user.signOut")}
					</button>
				</div>
			</aside>
			{/* Main Content */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				{/* Header */}
				<header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
					<div className="flex items-center gap-4">
						<h1 className="text-xl font-bold text-foreground">
							{t("header.title")}
						</h1>
						<div className="h-6 w-px bg-border"></div>
						<button
							type="button"
							onClick={() => setCampaignModalOpen(true)}
							className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-sm font-medium border border-secondary-100 hover:bg-secondary/80 transition-colors cursor-pointer"
						>
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							<span>{currentCampaign?.name || t("header.campaign")}</span>
						</button>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setShowDrafts(!showDrafts)}
							className={`p-2 rounded-lg transition-colors ${
								showDrafts
									? "text-primary bg-primary/10"
									: "text-muted-foreground hover:text-primary hover:bg-primary/5"
							}`}
							title={
								showDrafts ? t("timeline.drafts") : t("timeline.showDrafts")
							}
						>
							<FileText size={20} />
						</button>
						<button
							type="button"
							className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
						>
							<Settings size={20} />
						</button>
						<Button
							variant="default"
							onClick={() => setAiModalOpen(true)}
							className="text-sm h-9 px-4"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							{t("actions.generate")}
						</Button>
						<Button className="text-sm h-9 px-4" onClick={handleCreatePost}>
							<Plus className="w-4 h-4 mr-2" />
							{t("actions.newPost")}
						</Button>
					</div>
				</header>

				{/* Swimlane Container */}
				<div className="flex-1 overflow-hidden relative bg-background flex flex-col">
					{/* Date Header (Sticky) */}
					<div className="flex border-b border-border bg-card z-10 shadow-sm">
						<div className="w-48 flex-shrink-0 p-4 border-r border-border bg-secondary/20 font-semibold text-foreground text-sm flex items-end pb-2">
							{t("channels.title")}
						</div>
						<div
							className="flex-1 overflow-x-auto overflow-y-hidden"
							ref={headerScrollRef}
						>
							<div
								className="flex"
								style={{
									width: `${dates.length * 200 + (showDrafts ? 200 : 0)}px`,
								}}
							>
								{showDrafts && (
									<div className="w-[200px] flex-shrink-0 p-3 border-r border-border bg-secondary/10">
										<div className="text-xs font-medium uppercase mb-1 text-muted-foreground">
											{t("timeline.drafts")}
										</div>
										<div className="flex items-center gap-2">
											<span className="text-xl font-bold text-foreground">
												<FileText size={20} />
											</span>
										</div>
									</div>
								)}
								{dates.map((date) => {
									const isToday = new Date().getDate() === date.dayNum;
									return (
										<div
											key={date.iso}
											className={`w-[200px] flex-shrink-0 p-3 border-r border-border ${isToday ? "bg-primary/5" : "bg-card"}`}
										>
											<div
												className={`text-xs font-medium uppercase mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}
											>
												{date.dayName}
											</div>
											<div className="flex items-center gap-2">
												<span
													className={`text-xl font-bold ${isToday ? "text-primary" : "text-foreground"}`}
												>
													{date.dayNum}
												</span>
												<span className="text-xs text-muted-foreground">
													{date.month}
												</span>
												{isToday && (
													<span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
														{t("timeline.today")}
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Scrollable Swimlane Body */}
					<div
						className="flex-1 overflow-x-auto overflow-y-auto"
						ref={scrollContainerRef}
					>
						<ChannelsTimeline
							userChannels={userChannels}
							campaignId={campaignId}
							dates={dates}
							showDrafts={showDrafts}
							onEditPost={handleEditPost}
							onConnectChannel={() => setChannelModalOpen(true)}
							t={t}
						/>
					</div>
				</div>
			</main>
			<AIPanel
				isOpen={isAiModalOpen}
				onClose={() => setAiModalOpen(false)}
				onGenerate={handleAiGeneration}
			/>
			{user?.id && (
				<ChannelConnectionModal
					userId={user.id}
					isOpen={isChannelModalOpen}
					onClose={() => setChannelModalOpen(false)}
				/>
			)}
			<CampaignSelectorModal
				isOpen={isCampaignModalOpen}
				onClose={() => setCampaignModalOpen(false)}
				onSelectCampaign={handleCampaignSelect}
			/>
			{user?.id && currentCampaign && (
				<PostCreationModal
					isOpen={isPostModalOpen}
					onClose={() => setPostModalOpen(false)}
					userChannels={userChannels}
					onCreatePost={() => {
						// Post creation/update is handled by the collection
						// We just need to close the modal, which is handled by onClose in the modal
						// But the modal calls onCreatePost, so we can use this to refresh or show toast
						setPostModalOpen(false);
					}}
					currentCampaign={currentCampaign}
					userId={user.id}
					editMode={!!editingPost}
					postToEdit={editingPost || undefined}
				/>
			)}
		</div>
	);
};
