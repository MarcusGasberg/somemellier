import { CheckCircle, Clock } from "lucide-react";

interface Post {
	status: "published" | "scheduled" | "draft";
	content: string;
	type: string;
}

interface PostCardProps {
	post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
	const statusColors = {
		published: "bg-emerald-50 text-emerald-700 border-emerald-200",
		scheduled: "bg-sky-50 text-sky-700 border-sky-200",
		draft: "bg-stone-50 text-stone-600 border-stone-200",
	} as const;

	return (
		<div
			className={`p-3 rounded-lg border ${statusColors[post.status]} mb-2 shadow-sm text-xs relative group cursor-pointer hover:shadow-md transition-all`}
		>
			<div className="flex justify-between items-start mb-2">
				<span className="font-semibold capitalize opacity-80">
					{post.status}
				</span>
				{post.status === "published" && <CheckCircle size={12} />}
				{post.status === "scheduled" && <Clock size={12} />}
			</div>
			<p className="line-clamp-3 font-medium mb-2">{post.content}</p>
			<div className="flex justify-between items-center text-[10px] opacity-70">
				<span className="uppercase tracking-wider">{post.type}</span>
			</div>
		</div>
	);
};
