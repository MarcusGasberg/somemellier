import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCampaigns } from "@/hooks/use-campaigns";
import { Loader2, Plus } from "lucide-react";
import type { Campaign } from "@/db/schema/campaigns-schema";

interface CampaignSelectorModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectCampaign: (campaign: Campaign) => void;
}

export const CampaignSelectorModal = ({
	isOpen,
	onClose,
	onSelectCampaign,
}: CampaignSelectorModalProps) => {
	const { t } = useTranslation("dashboard");
	const { data: campaigns = [] } = useCampaigns();
	const [isCreating, setIsCreating] = useState(false);
	const [newCampaignName, setNewCampaignName] = useState("");
	const [creatingCampaignId, setCreatingCampaignId] = useState<string | null>(
		null,
	);

	const handleCreateCampaign = async () => {
		if (!newCampaignName.trim()) return;

		setCreatingCampaignId("new");
		try {
			const response = await fetch("/api/campaigns", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: newCampaignName.trim(),
					description: null,
					isDefault: false,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create campaign");
			}

			const data = (await response.json()) as { campaign: Campaign };
			onSelectCampaign(data.campaign);
			onClose();
			setNewCampaignName("");
		} catch (error) {
			console.error("Failed to create campaign:", error);
		} finally {
			setCreatingCampaignId(null);
		}
	};

	const handleSelectCampaign = (campaign: Campaign) => {
		onSelectCampaign(campaign);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("campaigns.select")}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Create New Campaign Section */}
					<div className="space-y-3">
						{isCreating ? (
							<div className="space-y-3">
								<div>
									<Label htmlFor="campaign-name">{t("campaigns.create")}</Label>
									<Input
										id="campaign-name"
										value={newCampaignName}
										onChange={(e) => setNewCampaignName(e.target.value)}
										placeholder={t("campaigns.namePlaceholder")}
										className="mt-1"
									/>
								</div>
								<div className="flex gap-2">
									<Button
										onClick={handleCreateCampaign}
										disabled={
											!newCampaignName.trim() || creatingCampaignId === "new"
										}
										size="sm"
										className="flex-1"
									>
										{creatingCampaignId === "new" ? (
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
										) : (
											<Plus className="h-4 w-4 mr-2" />
										)}
										Create
									</Button>
									<Button
										variant="outline"
										onClick={() => setIsCreating(false)}
										size="sm"
									>
										Cancel
									</Button>
								</div>
							</div>
						) : (
							<Button
								onClick={() => setIsCreating(true)}
								variant="outline"
								className="w-full justify-start"
							>
								<Plus className="h-4 w-4 mr-2" />
								{t("campaigns.create")}
							</Button>
						)}
					</div>

					{/* Campaign List */}
					{campaigns.length > 0 && (
						<div className="space-y-2">
							<div className="text-sm font-medium text-muted-foreground">
								{t("campaigns.select")}
							</div>
							<div className="grid gap-2 max-h-60 overflow-y-auto">
								{campaigns.map((campaign) => (
									<div
										key={campaign.id}
										className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
										onClick={() => handleSelectCampaign(campaign)}
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
												<span className="text-sm font-medium text-primary">
													{campaign.name.charAt(0).toUpperCase()}
												</span>
											</div>
											<div>
												<div className="font-medium">{campaign.name}</div>
												{campaign.isDefault && (
													<div className="text-xs text-muted-foreground">
														{t("campaigns.default")}
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
