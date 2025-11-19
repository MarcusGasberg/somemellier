import { Dashboard } from "@/components/dashboard";
import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	const logout = () => authClient.signOut();

	return <Dashboard user={session?.user} onLogout={logout} />;
}
