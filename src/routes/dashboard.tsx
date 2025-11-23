import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";
import { userChannelCollection } from "@/hooks/use-user-channels";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	loader: async () => {
		// Preload the collection in the loader
		await userChannelCollection.preload();
		return null;
	},
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	const logout = () => authClient.signOut();

	return <Dashboard user={session?.user} onLogout={logout} />;
}
