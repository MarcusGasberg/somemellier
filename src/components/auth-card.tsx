import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AuthCardProps {
	title: string;
	subtitle: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">{title}</CardTitle>
					<CardDescription>{subtitle}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">{children}</CardContent>
				{footer && <div className="px-6 pb-6">{footer}</div>}
			</Card>
		</div>
	);
}

export function AuthDivider({ text }: { text: string }) {
	return (
		<div className="relative">
			<div className="absolute inset-0 flex items-center">
				<Separator className="w-full" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-background px-2 text-muted-foreground">{text}</span>
			</div>
		</div>
	);
}
