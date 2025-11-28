import { useEffect, useState } from "react";
import { X, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ChannelIcon } from "./channel-icon";
import type { Campaign } from "@/db/schema/campaigns-schema";
import { postCollection } from "@/hooks/use-posts";
import type { Post } from "../data/posts";
import type { UserChannel } from "../data/user-channels";

interface PostCreationModalProps {
	isOpen: boolean;
	userId: string;
	onClose: () => void;
	onCreatePost: (post: Post) => void;
	prefillData?: PostCreationModalPrefillData;
	currentCampaign: Campaign;
	editMode?: boolean;
	postToEdit?: Post;
	userChannels: UserChannel[];
}

export interface PostCreationModalPrefillData {
	channelId?: string;
	scheduledAt?: Date;
}

export const PostCreationModal = ({
	isOpen,
	onClose,
	onCreatePost,
	prefillData,
	currentCampaign,
	userId,
	editMode = false,
	postToEdit,
	userChannels,
}: PostCreationModalProps) => {
	const [loading, setLoading] = useState(false);

	const form = useForm({
		defaultValues: {
			content: postToEdit?.content || "",
			channelId: postToEdit?.channelId || prefillData?.channelId || "",
			postType: postToEdit?.postType || "thought-leadership",
			scheduledAt:
				postToEdit?.scheduledAt || prefillData?.scheduledAt || undefined,
			title: postToEdit?.title || "",
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			try {
				if (editMode && postToEdit) {
					const updatedPostData: Post = {
						...postToEdit,
						channelId: value.channelId,
						postType: value.postType,
						content: value.content,
						scheduledAt: value.scheduledAt ?? null,
						title: value.title,
						updatedAt: new Date(),
						status: value.scheduledAt ? "scheduled" : "draft",
					};

					postCollection.update(updatedPostData.id, (draft) => {
						Object.assign(draft, updatedPostData);
					});
					onCreatePost(updatedPostData);
				} else {
					const postData: Post = {
						campaignId: currentCampaign.id,
						channelId: value.channelId,
						postType: value.postType,
						status: value.scheduledAt ? "scheduled" : "draft",
						content: value.content,
						createdAt: new Date(),
						id: crypto.randomUUID(),
						mediaAttachments: null,
						metadata: null,
						publishedAt: null,
						scheduledAt: value.scheduledAt ?? null,
						title: value.title,
						updatedAt: new Date(),
						userId,
						analytics: null,
					};

					postCollection.insert(postData);
					onCreatePost(postData);
				}

				onClose();
				form.reset();
			} catch (error) {
				console.error("Error saving post:", error);
			} finally {
				setLoading(false);
			}
		},
	});

	useEffect(() => {
		if (isOpen && editMode && postToEdit) {
			form.reset({
				content: postToEdit.content,
				channelId: postToEdit.channelId,
				postType: postToEdit.postType,
				scheduledAt: postToEdit.scheduledAt || undefined,
				title: postToEdit.title ?? "",
			});
		}
	}, [isOpen, editMode, postToEdit, form]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in duration-200">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
						<Hash className="text-primary" />
						{editMode ? "Edit Post" : "Create New Post"}
					</h2>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X size={20} />
					</Button>
				</div>

				{/* Campaign Context */}
				<div className="mb-4 p-3 bg-secondary/20 rounded-lg border border-secondary/40">
					<div className="text-sm text-muted-foreground mb-1">Campaign</div>
					<div className="font-medium text-foreground">
						{currentCampaign.name}
					</div>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					{/* Title */}
					<form.Field
						name="title"
						validators={{
							onChange: z
								.string()
								.min(1, "Title is required")
								.max(50, "Title too long"),
						}}
						children={(field) => (
							<div>
								<Label className="block text-sm font-medium text-foreground mb-1">
									Title
								</Label>
								<Input
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="What's the title of your post?"
									className="resize-none"
								/>
								<div className="flex justify-between items-center mt-1">
									{field.state.meta.errors.length > 0 && (
										<p className="text-sm text-destructive">
											{field.state.meta.errors[0]?.message || "Invalid content"}
										</p>
									)}
									<span className="text-xs text-muted-foreground ml-auto">
										{field.state.value?.length ?? 0}/50
									</span>
								</div>
							</div>
						)}
					/>
					{/* Content */}
					<form.Field
						name="content"
						validators={{
							onChange: z
								.string()
								.min(1, "Content is required")
								.max(280, "Content too long"),
						}}
						children={(field) => (
							<div>
								<Label className="block text-sm font-medium text-foreground mb-1">
									Content
								</Label>
								<Textarea
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="What's on your mind?"
									rows={4}
									className="resize-none"
								/>
								<div className="flex justify-between items-center mt-1">
									{field.state.meta.errors.length > 0 && (
										<p className="text-sm text-destructive">
											{field.state.meta.errors[0]?.message || "Invalid content"}
										</p>
									)}
									<span className="text-xs text-muted-foreground ml-auto">
										{field.state.value.length}/280
									</span>
								</div>
							</div>
						)}
					/>

					{/* Channel Selection */}
					<form.Field
						name="channelId"
						validators={{
							onChange: z.string().min(1, "Channel selection is required"),
						}}
						children={(field) => (
							<div>
								<Label className="block text-sm font-medium text-foreground mb-1">
									Channel {field.state.value}
								</Label>
								<Select
									defaultValue={postToEdit?.channelId ?? prefillData?.channelId}
									name={field.name}
									onValueChange={(value) => field.handleChange(value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a channel" />
									</SelectTrigger>
									<SelectContent>
										{userChannels.map((channel) => (
											<SelectItem key={channel.id} value={channel.id}>
												<div className="flex items-center gap-2">
													<ChannelIcon iconKey={channel.iconKey} />
													{channel.name}
													{channel.accountId && (
														<span className="text-muted-foreground">
															@{channel.accountId}
														</span>
													)}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{field.state.meta.errors.length > 0 && (
									<p className="text-sm text-destructive mt-1">
										{field.state.meta.errors[0]?.message ||
											"Please select a channel"}
									</p>
								)}
							</div>
						)}
					/>

					{/* Post Type */}
					<form.Field
						name="postType"
						children={(field) => (
							<div>
								<Label className="block text-sm font-medium text-foreground mb-1">
									Post Type
								</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="thought-leadership">
											Thought Leadership
										</SelectItem>
										<SelectItem value="educational">Educational</SelectItem>
										<SelectItem value="lifestyle">Lifestyle</SelectItem>
										<SelectItem value="promotional">Promotional</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					/>

					{/* Schedule Date/Time */}
					<form.Field
						name="scheduledAt"
						validators={{
							onChange: (value) => {
								if (value && value.value) {
									const today = new Date();
									today.setHours(0, 0, 0, 0);
									const selectedDate = new Date(value.value);
									selectedDate.setHours(0, 0, 0, 0);
									if (selectedDate < today) {
										return "Cannot schedule posts in the past";
									}
								}
								return undefined;
							},
						}}
						children={(field) => {
							const today = new Date();
							today.setHours(0, 0, 0, 0);

							return (
								<div>
									<Label className="block text-sm font-medium text-foreground mb-1">
										Schedule (Optional)
									</Label>
									<div className="flex gap-2">
										<DatePicker
											date={field.state.value ?? prefillData?.scheduledAt}
											setDate={(date) => field.handleChange(date)}
											className="flex-1 w-auto"
											fromDate={today}
										/>
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={() => field.handleChange(undefined)}
											title="Clear schedule"
										>
											<X size={16} />
										</Button>
									</div>
									{field.state.meta.errors.length > 0 ? (
										<p className="text-xs text-destructive mt-1">
											{field.state.meta.errors[0]}
										</p>
									) : (
										<p className="text-xs text-muted-foreground mt-1">
											Leave empty to save as draft
										</p>
									)}
								</div>
							);
						}}
					/>

					{/* Submit Button */}
					<div className="pt-4">
						<form.Subscribe
							selector={(state) => [state.canSubmit]}
							children={([canSubmit]) => (
								<Button
									type="submit"
									variant="default"
									className="w-full h-12"
									disabled={!canSubmit || loading}
								>
									{loading ? (
										<span className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											{editMode ? "Updating Post..." : "Creating Post..."}
										</span>
									) : (
										<span className="flex items-center gap-2">
											<Calendar size={16} />
											{editMode ? "Update Post" : "Create Post"}
										</span>
									)}
								</Button>
							)}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};
