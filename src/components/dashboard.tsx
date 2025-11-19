import {
	BarChart3,
	Calendar,
	Instagram,
	Layout,
	Linkedin,
	MessageSquare,
	Plus,
	Settings,
	Sparkles,
	Twitter,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
		id: "twitter",
		name: "Twitter",
		icon: <Twitter size={18} className="text-blue-400" />,
	},
	{
		id: "instagram",
		name: "Instagram",
		icon: <Instagram size={18} className="text-pink-500" />,
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: <Linkedin size={18} className="text-blue-700" />,
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
	const [dates, setDates] = useState<DashboardDate[]>([]);
	const [posts, setPosts] = useState(INITIAL_POSTS);
	const [isAiModalOpen, setAiModalOpen] = useState(false);
	const scrollContainerRef = useRef(null);

	useEffect(() => {
		setDates(generateDates(21)); // Generate 3 weeks
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
					<span className="text-foreground font-bold text-lg">SocialAI</span>
				</div>

				<div className="p-4 space-y-1">
					<div className="text-xs uppercase font-bold text-muted-foreground mb-2 px-2">
						Menu
					</div>
					<button
						type="button"
						className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-primary/10 text-primary rounded-lg border border-primary/20"
					>
						<Layout size={18} /> Dashboard
					</button>
					<button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
						<Calendar size={18} /> Calendar
					</button>
					<button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
						<MessageSquare size={18} /> Mentions
					</button>
					<button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
						<BarChart3 size={18} /> Analytics
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
							<div className="text-xs text-muted-foreground">Pro Plan</div>
						</div>
					</div>
					<button
						onClick={onLogout}
						className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
					>
						Sign Out
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				{/* Header */}
				<header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
					<div className="flex items-center gap-4">
						<h1 className="text-xl font-bold text-foreground">
							Campaign Overview
						</h1>
						<div className="h-6 w-px bg-border"></div>
						<div className="flex items-center text-sm text-muted-foreground gap-2">
							<span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
								Active
							</span>
							<span>Q4 Growth Push</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
							<Settings size={20} />
						</button>
						<Button
							variant="default"
							onClick={() => setAiModalOpen(true)}
							className="text-sm h-9 px-4"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							Generate
						</Button>
						<Button className="text-sm h-9 px-4">
							<Plus className="w-4 h-4 mr-2" />
							New Post
						</Button>
					</div>
				</header>

				{/* Swimlane Container */}
				<div className="flex-1 overflow-hidden relative bg-background flex flex-col">
					{/* Date Header (Sticky) */}
					<div className="flex border-b border-border bg-card z-10 shadow-sm">
						<div className="w-48 flex-shrink-0 p-4 border-r border-border bg-secondary font-semibold text-muted-foreground text-sm flex items-end pb-2">
							Channels
						</div>
						<div
							className="flex-1 overflow-hidden"
							ref={(el) => {
								if (el && scrollContainerRef.current) {
									// Sync header scroll with body scroll if implemented separately,
									// but here we will put dates inside the main scroll area for simplicity or use CSS grid.
								}
							}}
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
														TODAY
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
					<div className="flex-1 overflow-auto" ref={scrollContainerRef}>
						<div className="flex flex-col min-w-max">
							{CHANNELS.map((channel) => (
								<div
									key={channel.id}
									className="flex border-b border-border min-h-[180px]"
								>
									{/* Channel Column (Sticky Left) */}
									<div className="sticky left-0 w-48 flex-shrink-0 bg-card border-r border-border p-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
										<div className="flex items-center gap-3 mb-2">
											<div className="p-2 bg-secondary rounded-lg border border-border">
												{channel.icon}
											</div>
											<span className="font-semibold text-foreground">
												{channel.name}
											</span>
										</div>
										<div className="text-xs text-muted-foreground pl-1">
											3 posts scheduled this week
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
													className={`w-[200px] flex-shrink-0 p-3 border-r border-border relative group transition-colors hover:bg-secondary/50 ${isToday ? "bg-primary/10" : ""}`}
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
																Empty Slot
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
