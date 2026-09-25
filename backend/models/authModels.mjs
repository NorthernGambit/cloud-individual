import { z } from "zod";

export const registerSchema = z.object({
	username: z
		.string()
		.min(3)
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, underscores and hyphens",
		)
		.transform((uname) => uname.toLowerCase()),
	email: z
		.email()
		.trim()
		.transform((email) => email.toLowerCase()),
	password: z.string().min(8),
});
