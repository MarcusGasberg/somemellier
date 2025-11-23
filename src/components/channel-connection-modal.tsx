import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ChannelIcon } from "./channel-icon";
import {
	useAvailableChannels,
	userChannelCollection,
} from "@/hooks/use-user-channels";
import { Loader2 } from "lucide-react";
import type { Channel } from "@/db/schema/channels-schema";

interface ChannelConnectionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const ChannelConnectionModal = ({
	isOpen,
	onClose,
}: ChannelConnectionModalProps) => {
	const { data: availableChannels = [], isLoading } = useAvailableChannels();
	const [connectingChannelId, setConnectingChannelId] = useState<string | null>(
		null,
	);

	const handleConnect = async (channel: Channel) => {
		setConnectingChannelId(channel.id);
		try {
			userChannelCollection.insert({
				id: crypto.randomUUID(),
				createdAt: new Date(),
				iconKey: channel.iconKey,
				name: channel.name,
				type: channel.type,
				updatedAt: new Date(),
			});
			onClose();
		} catch (error) {
			console.error("Failed to connect channel:", error);
		} finally {
			setConnectingChannelId(null);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Connect Social Media Account</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : availableChannels.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							All available channels are already connected!
						</div>
					) : (
						<div className="grid gap-3">
							{availableChannels.map((channel) => (
								<div
									key={channel.id}
									className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-secondary/40 rounded-lg">
											<ChannelIcon iconKey={channel.iconKey} />
										</div>
										<div>
											<div className="font-medium">{channel.name}</div>
											<div className="text-sm text-muted-foreground">
												{channel.metadata?.description}
											</div>
										</div>
									</div>
									<Button
										onClick={() => handleConnect(channel)}
										disabled={connectingChannelId === channel.id}
										size="sm"
									>
										{connectingChannelId === channel.id ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Connect"
										)}
									</Button>
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
