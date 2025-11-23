import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { campaigns } from "@/db/schema/campaigns-schema";
import { posts } from "@/db/schema/posts-schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export const Route = createFileRoute("/api/campaigns")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const url = new URL(request.url);
					const campaignId = url.searchParams.get("id");

					if (campaignId) {
						// Get single campaign
						const campaign = await db
							.select()
							.from(campaigns)
							.where(
								and(
									eq(campaigns.id, campaignId),
									eq(campaigns.userId, session.user.id),
								),
							)
							.limit(1);

						if (campaign.length === 0) {
							return new Response(
								JSON.stringify({ error: "Campaign not found" }),
								{
									status: 404,
									headers: { "Content-Type": "application/json" },
								},
							);
						}

						return new Response(JSON.stringify({ campaign: campaign[0] }), {
							headers: { "Content-Type": "application/json" },
						});
					}

					// Get all campaigns
					const userCampaigns = await db
						.select()
						.from(campaigns)
						.where(eq(campaigns.userId, session.user.id));
					return new Response(JSON.stringify({ campaigns: userCampaigns }), {
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error fetching campaigns:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
			POST: async ({ request }) => {
				try {
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const body: Record<string, any> = await request.json();
					const newCampaign = await db
						.insert(campaigns)
						.values({
							id: crypto.randomUUID(),
							userId: session.user.id,
							name: body.name,
							description: body.description || null,
							isDefault: body.isDefault || false,
						})
						.returning();

					return new Response(JSON.stringify({ campaign: newCampaign[0] }), {
						status: 201,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error creating campaign:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
			PUT: async ({ request }) => {
				try {
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const url = new URL(request.url);
					const campaignId = url.searchParams.get("id");

					if (!campaignId) {
						return new Response(
							JSON.stringify({ error: "Campaign ID required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const body: Record<string, any> = await request.json();
					const updatedCampaign = await db
						.update(campaigns)
						.set(body)
						.where(
							and(
								eq(campaigns.id, campaignId),
								eq(campaigns.userId, session.user.id),
							),
						)
						.returning();

					if (updatedCampaign.length === 0) {
						return new Response(
							JSON.stringify({ error: "Campaign not found" }),
							{
								status: 404,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					return new Response(
						JSON.stringify({ campaign: updatedCampaign[0] }),
						{
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (error) {
					console.error("Error updating campaign:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
			DELETE: async ({ request }) => {
				try {
					const session = await auth.api.getSession({
						headers: request.headers,
					});
					if (!session?.user?.id) {
						return new Response(JSON.stringify({ error: "Unauthorized" }), {
							status: 401,
							headers: { "Content-Type": "application/json" },
						});
					}

					const url = new URL(request.url);
					const campaignId = url.searchParams.get("id");

					if (!campaignId) {
						return new Response(
							JSON.stringify({ error: "Campaign ID required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Check if campaign has posts
					const campaignPosts = await db
						.select()
						.from(posts)
						.where(eq(posts.campaignId, campaignId));

					if (campaignPosts.length > 0) {
						return new Response(
							JSON.stringify({
								error:
									"Cannot delete campaign with existing posts. Please reassign or delete posts first.",
							}),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const deletedCampaign = await db
						.delete(campaigns)
						.where(
							and(
								eq(campaigns.id, campaignId),
								eq(campaigns.userId, session.user.id),
							),
						)
						.returning();

					if (deletedCampaign.length === 0) {
						return new Response(
							JSON.stringify({ error: "Campaign not found" }),
							{
								status: 404,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					return new Response(
						JSON.stringify({ campaign: deletedCampaign[0] }),
						{
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (error) {
					console.error("Error deleting campaign:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
