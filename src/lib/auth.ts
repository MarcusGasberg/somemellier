import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "@/db";
import { must } from "./must";
import { user, session, account, verification } from "../db/schema/auth-schema";

const betterAuthSecret = must(
	process.env.BETTER_AUTH_SECRET,
	"BETTER_AUTH_SECRET must be set",
);

export const auth = betterAuth({
	secret: betterAuthSecret,
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	plugins: [reactStartCookies()],
});
