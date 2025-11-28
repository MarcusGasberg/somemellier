import {
	BarChart3,
	Calendar,
	FileText,
	Layout,
	Menu,
	MessageSquare,
	Plus,
	Settings,
	Sparkles,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { AIPanel } from "./ai-panel";
import { ChannelConnectionModal } from "./channel-connection-modal";
import { CampaignSelectorModal } from "./campaign-selector-modal";
import {
	PostCreationModal,
	type PostCreationModalPrefillData,
} from "./post-creation-modal";
import { ChannelsTimeline } from "./channels-timeline";
import { userChannelCollection } from "@/hooks/use-user-channels";
import { useCurrentCampaign, useCampaigns } from "@/hooks/use-campaigns";
import { useColumnWidth } from "@/hooks/use-mobile";
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
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [prefillCreateData, setPrefillCreateData] =
		useState<PostCreationModalPrefillData | null>(null);
	const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
	const [showDrafts, setShowDrafts] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [isFabOpen, setIsFabOpen] = useState(false);
	const columnWidth = useColumnWidth();
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

	useEffect(() => {
		if (!isPostModalOpen) {
			setPrefillCreateData(null);
		}
	}, [isPostModalOpen]);

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

	const handleCreatePost = (prefillData: PostCreationModalPrefillData) => {
		setEditingPost(null);
		setPrefillCreateData(prefillData);
		setPostModalOpen(true);
	};

	return (
		<div className="flex h-screen bg-background overflow-hidden font-sans">
			{/* Sidebar - Desktop */}
			<aside className="hidden md:flex w-64 bg-card text-muted-foreground flex-col flex-shrink-0 transition-all duration-300">
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

			{/* Mobile Sidebar */}
			<Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
				<SheetContent side="left" className="w-64 p-0">
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
							onClick={() => {
								setIsMobileSidebarOpen(false);
								onLogout();
							}}
							className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
						>
							{t("user.signOut")}
						</button>
					</div>
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				{/* Header */}
				<header className="h-16 md:h-16 bg-card border-b border-border flex flex-col md:flex-row md:items-center justify-center md:justify-between px-4 md:px-6 py-2 md:py-0 flex-shrink-0 gap-2 md:gap-0">
					{/* Top row: Menu button, title, campaign selector */}
					<div className="flex items-center justify-between md:justify-start gap-4">
						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setIsMobileSidebarOpen(true)}
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle menu</span>
						</Button>
						<h1 className="text-lg md:text-xl font-bold text-foreground">
							{t("header.title")}
						</h1>
						<div className="hidden md:block h-6 w-px bg-border"></div>
						<button
							type="button"
							onClick={() => setCampaignModalOpen(true)}
							className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-sm font-medium border border-secondary-100 hover:bg-secondary/80 transition-colors cursor-pointer"
						>
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							<span className="hidden sm:inline">
								{currentCampaign?.name || t("header.campaign")}
							</span>
							<span className="sm:hidden">
								{(currentCampaign?.name || t("header.campaign")).slice(0, 8)}...
							</span>
						</button>
					</div>

					{/* Bottom row: Action buttons */}
					<div className="flex items-center justify-end gap-1 md:gap-3">
						{/* Desktop-only action buttons - moved to FAB on mobile */}
						<button
							type="button"
							onClick={() => setShowDrafts(!showDrafts)}
							className={`hidden md:flex p-2 md:p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
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
							className="hidden md:flex p-2 md:p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
						>
							<Settings size={20} />
						</button>
						{/* Desktop-only action buttons - moved to FAB on mobile */}
						<Button
							variant="default"
							onClick={() => setAiModalOpen(true)}
							className="hidden md:flex text-sm h-9 px-4"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							{t("actions.generate")}
						</Button>
						<Button
							className="hidden md:flex text-sm h-9 px-4"
							onClick={() => handleCreatePost({})}
						>
							<Plus className="w-4 h-4 mr-2" />
							{t("actions.newPost")}
						</Button>
					</div>
				</header>

				{/* Swimlane Container */}
				<div className="flex-1 overflow-hidden relative bg-background flex flex-col">
					{/* Date Header (Sticky) */}
					<div className="flex border-b border-border bg-card z-10 shadow-sm">
						<div className="w-32 md:w-48 flex-shrink-0 p-3 md:p-4 border-r border-border bg-secondary/20 font-semibold text-foreground text-xs md:text-sm flex items-end pb-2">
							<span className="hidden sm:inline">{t("channels.title")}</span>
							<span className="sm:hidden">Channels</span>
						</div>
						<div
							className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
							ref={headerScrollRef}
							style={{
								scrollBehavior: "smooth",
								WebkitOverflowScrolling: "touch",
							}}
						>
							<div
								className="flex"
								style={{
									width: `${dates.length * columnWidth + (showDrafts ? columnWidth : 0)}px`,
								}}
							>
								{showDrafts && (
									<div className="w-[120px] md:w-[200px] flex-shrink-0 p-2 md:p-3 border-r border-border bg-secondary/10">
										<div className="text-xs font-medium uppercase mb-1 text-muted-foreground">
											<span className="hidden sm:inline">
												{t("timeline.drafts")}
											</span>
											<span className="sm:hidden">Drafts</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-lg md:text-xl font-bold text-foreground">
												<FileText size={16} className="md:w-5 md:h-5" />
											</span>
										</div>
									</div>
								)}
								{dates.map((date) => {
									const isToday = new Date().getDate() === date.dayNum;
									return (
										<div
											key={date.iso}
											className={`w-[120px] md:w-[200px] flex-shrink-0 p-2 md:p-3 border-r border-border ${isToday ? "bg-primary/5" : "bg-card"}`}
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
						className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide"
						ref={scrollContainerRef}
						style={{
							scrollBehavior: "smooth",
							WebkitOverflowScrolling: "touch",
						}}
					>
						<ChannelsTimeline
							userChannels={userChannels}
							campaignId={campaignId}
							dates={dates}
							showDrafts={showDrafts}
							columnWidth={columnWidth}
							onEditPost={handleEditPost}
							onAddPost={handleCreatePost}
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
					prefillData={prefillCreateData ?? undefined}
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

			{/* Floating Action Button - Mobile */}
			<div className="fixed flex flex-col bottom-6 right-6 z-50 md:hidden">
				{/* FAB Actions */}
				{
					<div
						className={`flex flex-col items-end space-y-3 mb-4 transition-opacity duration-200 ${
							isFabOpen
								? "opacity-100 pointer-events-auto"
								: "opacity-0 pointer-events-none"
						}`}
					>
						{/* Settings Action */}
						<div className="flex items-center space-x-3">
							<div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
								<span className="text-sm font-medium text-foreground">
									Settings
								</span>
							</div>
							<Button
								size="icon"
								variant="outline"
								className="h-12 w-12 rounded-full shadow-lg"
								onClick={() => {
									// TODO: Open settings modal/panel
									setIsFabOpen(false);
								}}
							>
								<Settings className="h-5 w-5" />
							</Button>
						</div>

						{/* Show Drafts Action */}
						<div className="flex items-center space-x-3">
							<div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
								<span className="text-sm font-medium text-foreground">
									{showDrafts ? "Hide Drafts" : "Show Drafts"}
								</span>
							</div>
							<Button
								size="icon"
								variant={showDrafts ? "default" : "outline"}
								className="h-12 w-12 rounded-full shadow-lg"
								onClick={() => {
									setShowDrafts(!showDrafts);
									setIsFabOpen(false);
								}}
							>
								<FileText className="h-5 w-5" />
							</Button>
						</div>

						{/* New Post Action */}
						<div className="flex items-center space-x-3">
							<div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
								<span className="text-sm font-medium text-foreground">
									New Post
								</span>
							</div>
							<Button
								size="icon"
								className="h-12 w-12 rounded-full shadow-lg"
								onClick={() => {
									handleCreatePost({});
									setIsFabOpen(false);
								}}
							>
								<Plus className="h-5 w-5" />
							</Button>
						</div>

						{/* AI Generate Action */}
						<div className="flex items-center space-x-3">
							<div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
								<span className="text-sm font-medium text-foreground">
									Generate AI
								</span>
							</div>
							<Button
								size="icon"
								variant="secondary"
								className="h-12 w-12 rounded-full shadow-lg"
								onClick={() => {
									setAiModalOpen(true);
									setIsFabOpen(false);
								}}
							>
								<Sparkles className="h-5 w-5" />
							</Button>
						</div>
					</div>
				}

				{/* Main FAB Button */}
				<Button
					size="icon"
					className={`h-14 w-14 self-end rounded-full shadow-lg transition-transform duration-200 `}
					onClick={() => setIsFabOpen(!isFabOpen)}
				>
					{isFabOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
				</Button>
			</div>
		</div>
	);
};
