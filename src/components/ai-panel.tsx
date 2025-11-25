import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

interface GeneratedPost {
	channelId: string;
	content: string;
	type: string;
}

interface AIPanelProps {
	isOpen: boolean;
	onClose: () => void;
	onGenerate: (posts: GeneratedPost[]) => void;
}

const formSchema = z.object({
	topic: z.string().min(1, "Campaign topic is required"),
	tone: z.enum(["Professional", "Casual", "Excited", "Witty"]),
});

export const AIPanel = ({ isOpen, onClose, onGenerate }: AIPanelProps) => {
	const [loading, setLoading] = useState(false);

	const form = useForm({
		defaultValues: {
			topic: "",
			tone: "Professional" as const,
		},
		onSubmit: async ({ value }) => {
			// Validate the form
			const result = formSchema.safeParse(value);
			if (!result.success) {
				// Handle validation errors
				return;
			}

			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				const newPosts = [
					{
						channelId: "twitter",
						content: `Just discovered how ${value.topic} changes everything! 🤯 #Growth`,
						type: "thought-leadership",
					},
					{
						channelId: "linkedin",
						content: `We've been working hard on ${value.topic}. Here's what we learned about optimizing workflow and efficiency. 🧵👇`,
						type: "educational",
					},
					{
						channelId: "instagram",
						content: `Mood: ${value.topic} ✨`,
						type: "lifestyle",
					},
				];
				onGenerate(newPosts);
				setLoading(false);
				onClose();
				form.reset();
			}, 1500);
		},
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in duration-200">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
						<Sparkles className="text-primary" />
						AI Campaign Wizard
					</h2>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X size={20} />
					</Button>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field
						name="topic"
						validators={{
							onChange: z.string().min(1, "Campaign topic is required"),
						}}
						children={(field) => (
							<div>
								<Label className="block text-sm font-medium text-foreground mb-1">
									Campaign Topic
								</Label>
								<Input
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g., Black Friday Sale, New Feature Launch"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-sm text-destructive mt-1">
										{field.state.meta.errors[0]?.message || "Invalid input"}
									</p>
								)}
							</div>
						)}
					/>

					<form.Field
						name="tone"
						children={(field) => (
							<div>
								<Label className="block text-sm font-medium text-foreground mb-1">
									Tone of Voice
								</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value as any)}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Professional">Professional</SelectItem>
										<SelectItem value="Casual">Casual</SelectItem>
										<SelectItem value="Excited">Excited</SelectItem>
										<SelectItem value="Witty">Witty</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					/>

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
											Generating Magic...
										</span>
									) : (
										"Generate Campaign"
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
