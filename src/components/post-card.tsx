import { CheckCircle, Clock, Pencil } from "lucide-react";

interface Post {
	status: "published" | "scheduled" | "draft" | "failed";
	content: string;
	type: string;
}

interface PostCardProps {
	post: Post;
	onEdit?: (e: React.MouseEvent) => void;
}

export const PostCard = ({ post, onEdit }: PostCardProps) => {
	const statusColors = {
		published: "bg-emerald-50 text-emerald-700 border-emerald-200",
		scheduled: "bg-sky-50 text-sky-700 border-sky-200",
		draft: "bg-stone-50 text-stone-600 border-stone-200",
		failed: "bg-red-50 text-red-700 border-red-200",
	} as const;

	return (
		<div
			className={`p-3 rounded-lg border ${statusColors[post.status]} mb-2 shadow-sm text-xs relative group cursor-pointer hover:shadow-md transition-all`}
		>
			<div className="flex justify-between items-start mb-2">
				<span className="font-semibold capitalize opacity-80">
					{post.status}
				</span>
				<div className="flex items-center gap-2">
					{post.status !== "published" && onEdit && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onEdit(e);
							}}
							className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded transition-all"
							title="Edit post"
						>
							<Pencil size={12} />
						</button>
					)}
					{post.status === "published" && <CheckCircle size={12} />}
					{post.status === "scheduled" && <Clock size={12} />}
				</div>
			</div>
			<p className="line-clamp-3 font-medium mb-2">{post.content}</p>
			<div className="flex justify-between items-center text-[10px] opacity-70">
				<span className="uppercase tracking-wider">{post.type}</span>
			</div>
		</div>
	);
};
