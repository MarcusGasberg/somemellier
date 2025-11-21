import {
	XIcon,
	InstagramIcon,
	LinkedInIcon,
	TikTokIcon,
	FacebookIcon,
	YouTubeIcon,
} from "./icons/social-icons";

const CHANNEL_ICONS = {
	x: XIcon,
	instagram: InstagramIcon,
	linkedin: LinkedInIcon,
	tiktok: TikTokIcon,
	facebook: FacebookIcon,
	youtube: YouTubeIcon,
} as const;

interface ChannelIconProps extends React.SVGProps<SVGSVGElement> {
	iconKey: string;
}

export const ChannelIcon = ({ iconKey, ...props }: ChannelIconProps) => {
	const IconComponent = CHANNEL_ICONS[iconKey as keyof typeof CHANNEL_ICONS];
	return IconComponent ? <IconComponent {...props} /> : null;
};
