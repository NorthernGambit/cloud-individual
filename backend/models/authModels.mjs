import { z } from "zod";

// using transform to normalize both username and email
export const registerSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, "Username most be at least 3 characters long")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, underscores and hyphens",
		)
		.transform((uname) => uname.toLowerCase()),
	email: z
		.email()
		.trim()
		.transform((email) => email.toLowerCase()),
	password: z.string().min(8, "Username or email didn't match the password"),
});

export const loginSchema = z.object({
	usernameOrEmail: z.string().transform((val) => val.toLowerCase()),
	password: z.string(),
});
