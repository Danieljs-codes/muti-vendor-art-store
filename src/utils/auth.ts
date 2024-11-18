import { betterAuth } from "better-auth";
import pg from "pg";

const { Pool } = pg;

export const auth = betterAuth({
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 6,
		maxPasswordLength: 50,
		requireEmailVerification: true,
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		async sendVerificationEmail(data, request) {
			console.log(data, request);
		},
	},
	trustedOrigins: ["http://localhost:3000", "http://192.168.11.157:3000"],
});
