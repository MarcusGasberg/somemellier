import { authClient } from "@/lib/auth-client";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";
import { z } from "zod";

const dashboardSearchSchema = z.object({
	campaignId: z.string().optional(),
});

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	validateSearch: dashboardSearchSchema,
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	const router = useRouter();
	const { campaignId } = Route.useSearch();
	const logout = () => {
		authClient.signOut();
		router.navigate({
			to: "/login",
		});
	};

	return (
		<Dashboard user={session?.user} onLogout={logout} campaignId={campaignId} />
	);
}
