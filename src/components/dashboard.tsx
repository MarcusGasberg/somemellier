import {
	BarChart3,
	Calendar,
	Layout,
	MessageSquare,
	Plus,
	Settings,
	Sparkles,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { PostCard } from "./post-card";
import { AIPanel } from "./ai-panel";

interface User {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

interface DashboardProps {
	user?: User;
	onLogout: () => void;
}

const CHANNELS = [
	{
		id: "x",
		name: "X",
		icon: (
			<svg
				width={18}
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>X</title>
				<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
			</svg>
		),
	},
	{
		id: "instagram",
		name: "Instagram",
		icon: (
			<svg
				width={18}
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient
						id="instagramGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop
							offset="0%"
							style={{ stopColor: "#f58529", stopOpacity: 1 }}
						/>
						<stop
							offset="50%"
							style={{ stopColor: "#dd2a7b", stopOpacity: 1 }}
						/>
						<stop
							offset="100%"
							style={{ stopColor: "#8134af", stopOpacity: 1 }}
						/>
					</linearGradient>
				</defs>
				<title>Instagram</title>
				<path
					d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
					fill="url(#instagramGradient)"
				/>
			</svg>
		),
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: (
			<svg
				width={18}
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<style>{`.linkedin-icon { fill: #0A66C2; }`}</style>
				</defs>
				<title>LinkedIn</title>
				<path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.372-1.852 3.605 0 4.27 2.372 4.27 5.455v6.288zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.064 2.063-2.064 1.14 0 2.063.926 2.063 2.064 0 1.139-.923 2.065-2.063 2.065zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
					className="linkedin-icon"
				/>
			</svg>
		),
	},
	{
		id: "tiktok",
		name: "TikTok",
		icon: (
			<svg
				width={18}
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient
						id="tiktokGradient"
						x1="0%"
						y1="40%"
						x2="60%"
						y2="100%"
					>
						<stop
							offset="0%"
							style={{ stopColor: "#25F4EE", stopOpacity: 1 }}
						/>
						<stop
							offset="90%"
							style={{ stopColor: "#FE2C55", stopOpacity: 1 }}
						/>
					</linearGradient>
				</defs>
				<title>TikTok</title>
				<path
					d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
					fill="url(#tiktokGradient)"
				/>
			</svg>
		),
	},
	{
		id: "facebook",
		name: "Facebook",
		icon: (
			<svg
				width={18}
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<style>{`.facebook-icon { fill: #1877F2; }`}</style>
				</defs>
				<title>Facebook</title>
				<path
					d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"
					className="facebook-icon"
				/>
			</svg>
		),
	},
	{
		id: "youtube",
		name: "YouTube",
		icon: (
			<svg
				width={18}
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<style>{`.youtube-icon { fill: #FF0000; }`}</style>
				</defs>
				<title>YouTube</title>
				<path
					d="M23.499 6.203a2.997 2.997 0 0 0-2.11-2.12C19.938 3.5 12 3.5 12 3.5s-7.938 0-9.389.583a2.997 2.997 0 0 0-2.11 2.12A31.24 31.24 0 0 0 .001 12a31.24 31.24 0 0 0 .5 5.797 2.997 2.997 0 0 0 2.11 2.12c1.451.583 9.389.583 9.389.583s7.938 0 9.389-.583a2.997 2.997 0 0 0 2.11-2.12A31.24 31.24 0 0 0 24 12a31.24 31.24 0 0 0-.501-5.797zM9.546 15.568V8.432L15.818 12l-6.272 3.568z"
					className="youtube-icon"
				/>
			</svg>
		),
	},
];

interface DashboardDate {
	full: Date;
	dayName: string;
	dayNum: number;
	month: string;
	iso: string;
}

interface DashboardPost {
	id: number;
	channelId: string;
	date: string; // ISO date string
	content: string;
	status: "published" | "scheduled" | "draft";
	type: string;
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
const INITIAL_POSTS: DashboardPost[] = [
	{
		id: 1,
		channelId: "twitter",
		date: generateDates()[0].iso,
		content: "Excited to announce our new features! 🚀 #SaaS",
		status: "published",
		type: "announcement",
	},
	{
		id: 2,
		channelId: "linkedin",
		date: generateDates()[2].iso,
		content: "Here are 5 tips for better productivity.",
		status: "scheduled",
		type: "educational",
	},
	{
		id: 3,
		channelId: "instagram",
		date: generateDates()[1].iso,
		content: "Behind the scenes at the office today.",
		status: "draft",
		type: "bts",
	},
];

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
	const { t } = useTranslation("dashboard");
	const [dates] = useState<DashboardDate[]>(() => generateDates(21));
	const [posts, setPosts] = useState(INITIAL_POSTS);
	const [isAiModalOpen, setAiModalOpen] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const headerScrollRef = useRef<HTMLDivElement>(null);

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

	const handleAiGeneration = (
		generatedPosts: { channelId: string; content: string; type: string }[],
	) => {
		// Auto-schedule generated posts to the first available empty slot for that channel
		const newPosts: DashboardPost[] = generatedPosts.map((p, idx) => {
			// Simple logic: Schedule 1, 2, 3 days from today
			const targetDate = dates[idx + 1]?.iso || dates[0].iso;
			return {
				...p,
				id: Date.now() + idx,
				date: targetDate,
				status: "draft",
			};
		});
		setPosts([...posts, ...newPosts]);
	};

	const deletePost = (id: number) => {
		setPosts(posts.filter((p) => p.id !== id));
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
					<button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary/30 rounded-lg transition-colors">
						<Calendar size={18} /> {t("menu.calendar")}
					</button>
					<button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary/30 rounded-lg transition-colors">
						<MessageSquare size={18} /> {t("menu.mentions")}
					</button>
					<button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary/30 rounded-lg transition-colors">
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
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-sm font-medium  border border-secondary-100">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							<span>{t("header.campaign")}</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
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
						<Button className="text-sm h-9 px-4">
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
								style={{ width: `${dates.length * 200}px` }}
							>
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
						<div className="flex flex-col min-w-max">
							{CHANNELS.map((channel) => (
								<div
									key={channel.id}
									className="flex border-b border-border min-h-[180px]"
								>
									{/* Channel Column (Sticky Left) */}
									<div className="sticky left-0 w-48 flex-shrink-0 bg-card border-r border-border p-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
										<div className="flex items-center gap-3 mb-2">
											<div className="p-2 bg-secondary/40 rounded-lg border border-border">
												{channel.icon}
											</div>
											<span className="font-semibold text-foreground">
												{channel.name}
											</span>
										</div>
										<div className="text-xs text-muted-foreground pl-1">
											{t("channels.postsScheduled")}
										</div>
									</div>

									{/* Timeline Grid */}
									<div
										className="flex"
										style={{ width: `${dates.length * 200}px` }}
									>
										{dates.map((date) => {
											const dayPosts = posts.filter(
												(p) =>
													p.channelId === channel.id && p.date === date.iso,
											);
											const isToday = new Date().getDate() === date.dayNum;

											return (
												<div
													key={`${channel.id}-${date.iso}`}
													className={`w-[200px] flex-shrink-0 p-3 border-r border-border relative group transition-colors hover:bg-secondary/10 ${isToday ? "bg-primary/5 hover:bg-secondary/30" : ""}`}
												>
													{/* Add Button (Hidden until hover) */}
													<button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all">
														<Plus size={16} />
													</button>

													{/* Posts */}
													<div className="space-y-2">
														{dayPosts.map((post) => (
															<div
																key={post.id}
																className="relative group/card"
															>
																<PostCard post={post} />
																<button
																	onClick={() => deletePost(post.id)}
																	className="absolute -top-1 -right-1 bg-card rounded-full p-0.5 shadow-sm border border-border opacity-0 group-hover/card:opacity-100 text-destructive hover:text-destructive"
																>
																	<X size={12} />
																</button>
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
								</div>
							))}
						</div>
					</div>
				</div>
			</main>

			<AIPanel
				isOpen={isAiModalOpen}
				onClose={() => setAiModalOpen(false)}
				onGenerate={handleAiGeneration}
			/>
		</div>
	);
};
