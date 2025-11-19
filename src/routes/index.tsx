import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	BarChart3,
	Zap,
	Users,
	TrendingUp,
	Sparkles,
} from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

export const metadata = {
	title: "Somemellier - Social Media Marketing Platform",
	description:
		"Amplify your social media strategy with AI-powered insights and management tools",
};

function RouteComponent() {
	const { t } = useTranslation("index");

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<Sparkles className="w-5 h-5 text-primary-foreground" />
						</div>
						<span className="font-bold text-lg">{t("nav.brand")}</span>
					</div>
					<div className="hidden md:flex items-center gap-8">
						<a
							href="#features"
							className="text-sm hover:text-primary transition-colors"
						>
							{t("footer.sections.product.features")}
						</a>
						<a
							href="#pricing"
							className="text-sm hover:text-primary transition-colors"
						>
							{t("footer.sections.product.pricing")}
						</a>
					</div>
					<div className="flex items-center gap-3">
						<Button variant="ghost" size="sm">
							{t("nav.signIn")}
						</Button>
						<Button size="sm" className="bg-primary hover:bg-primary/90">
							{t("nav.getStarted")}
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div className="space-y-4">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-sm font-medium mb-8 border border-secondary-100">
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
									</span>
									{t("hero.badge")}
								</div>
								<h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
									{t("hero.title")}
								</h1>
								<p className="text-lg text-muted-foreground max-w-lg text-balance">
									{t("hero.subtitle")}
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									size="lg"
									className="bg-primary hover:bg-accent text-primary-foreground"
								>
									{t("hero.startFreeTrial")}
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
								<Button size="lg" variant="outline">
									{t("hero.watchDemo")}
								</Button>
							</div>
							<div className="flex items-center gap-8 pt-4">
								<div>
									<p className="text-2xl font-bold">
										{t("hero.stats.users.number")}
									</p>
									<p className="text-sm text-muted-foreground">
										{t("hero.stats.users.label")}
									</p>
								</div>
								<div>
									<p className="text-2xl font-bold">
										{t("hero.stats.posts.number")}
									</p>
									<p className="text-sm text-muted-foreground">
										{t("hero.stats.posts.label")}
									</p>
								</div>
								<div>
									<p className="text-2xl font-bold">
										{t("hero.stats.rating.number")}
									</p>
									<p className="text-sm text-muted-foreground">
										{t("hero.stats.rating.label")}
									</p>
								</div>
							</div>
						</div>

						{/* Hero Image */}
						<div className="relative h-96 md:h-full min-h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/30 overflow-hidden flex items-center justify-center">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center space-y-4">
									<BarChart3 className="w-24 h-24 text-primary mx-auto opacity-30" />
									<p className="text-muted-foreground">
										{t("hero.dashboardPreview")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<h2 className="text-4xl md:text-5xl font-bold">
							{t("features.title")}
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							{t("features.subtitle")}
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: Zap,
								title: t("features.items.smartScheduling.title"),
								description: t("features.items.smartScheduling.description"),
							},
							{
								icon: BarChart3,
								title: t("features.items.deepAnalytics.title"),
								description: t("features.items.deepAnalytics.description"),
							},
							{
								icon: Users,
								title: t("features.items.teamCollaboration.title"),
								description: t("features.items.teamCollaboration.description"),
							},
							{
								icon: TrendingUp,
								title: t("features.items.growthTracking.title"),
								description: t("features.items.growthTracking.description"),
							},
							{
								icon: Zap,
								title: t("features.items.contentLibrary.title"),
								description: t("features.items.contentLibrary.description"),
							},
							{
								icon: Users,
								title: t("features.items.influencerNetwork.title"),
								description: t("features.items.influencerNetwork.description"),
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:border-primary/50 group"
							>
								<div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
									<feature.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="text-xl font-bold mb-3">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto bg-primary rounded-2xl p-12 text-center space-y-8 relative overflow-hidden">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-0" />
					<div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-0" />

					<div className="relative z-10 space-y-6">
						<h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
							{t("cta.title")}
						</h2>
						<p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
							{t("cta.subtitle")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
							<Button size="lg" variant="secondary" className="font-semibold">
								{t("cta.getStartedFree")}
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-primary-foreground text-primary-foreground bg-primary-foreground/30 hover:bg-primary-foreground/10"
							>
								{t("cta.scheduleDemo")}
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-foreground/5 border-t border-border py-12 px-4 sm:px-6 lg:px-8 mt-24">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
									<Zap className="w-4 h-4 text-primary-foreground" />
								</div>
								<span className="font-bold">{t("footer.brand")}</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{t("footer.tagline")}
							</p>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-sm">
								{t("footer.sections.product.title")}
							</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("nav.features")}
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("nav.pricing")}
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.product.security")}
									</a>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-sm">
								{t("footer.sections.company.title")}
							</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.company.about")}
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.company.blog")}
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.company.careers")}
									</a>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-sm">
								{t("footer.sections.connect.title")}
							</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.connect.twitter")}
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.connect.instagram")}
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-foreground transition-colors"
									>
										{t("footer.sections.connect.linkedin")}
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
						<p className="text-sm text-muted-foreground">
							{t("footer.copyright", { year: new Date().getFullYear() })}
						</p>
						<div className="flex gap-6 text-sm text-muted-foreground mt-4 sm:mt-0">
							<a href="#" className="hover:text-foreground transition-colors">
								{t("footer.links.privacy")}
							</a>
							<a href="#" className="hover:text-foreground transition-colors">
								{t("footer.links.terms")}
							</a>
							<a href="#" className="hover:text-foreground transition-colors">
								{t("footer.links.cookies")}
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
