import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { channels } from "./schema/channels-schema";
import { must } from "@/lib/must";

config();

const connectionString = must(
	process.env.DATABASE_URL,
	"DATABASE_URL environment variable is not set",
);
const sql = neon(connectionString);
const db = drizzle({ client: sql });

async function seed() {
	try {
		console.log("🌱 Seeding channels...");

		// Insert predefined channels
		await db.insert(channels).values([
			{
				id: "x",
				name: "X",
				type: "x",
				iconKey: "x",
				config: {},
				metadata: {
					color: "#000000",
					description: "Formerly Twitter",
				},
			},
			{
				id: "instagram",
				name: "Instagram",
				type: "instagram",
				iconKey: "instagram",
				config: {},
				metadata: {
					color: "#E4405F",
					description: "Photo and video sharing platform",
				},
			},
			{
				id: "linkedin",
				name: "LinkedIn",
				type: "linkedin",
				iconKey: "linkedin",
				config: {},
				metadata: {
					color: "#0077B5",
					description: "Professional networking platform",
				},
			},
			{
				id: "tiktok",
				name: "TikTok",
				type: "tiktok",
				iconKey: "tiktok",
				config: {},
				metadata: {
					color: "#000000",
					description: "Short-form video platform",
				},
			},
			{
				id: "facebook",
				name: "Facebook",
				type: "facebook",
				iconKey: "facebook",
				config: {},
				metadata: {
					color: "#1877F2",
					description: "Social networking platform",
				},
			},
			{
				id: "youtube",
				name: "YouTube",
				type: "youtube",
				iconKey: "youtube",
				config: {},
				metadata: {
					color: "#FF0000",
					description: "Video sharing platform",
				},
			},
		]);

		console.log("✅ Channels seeded successfully!");
	} catch (error) {
		console.error("❌ Error seeding channels:", error);
		process.exit(1);
	} finally {
		// Neon handles connection cleanup automatically
	}
}

seed();
