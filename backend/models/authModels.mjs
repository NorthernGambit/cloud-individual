import { z } from "zod";

// using transform to normalize both username and email
export const registerSchema = z.object({
	username: z
		.string("username must be included in the body")
		.trim()
		.min(3, "Username must be at least 3 characters long")
		.max(16, "Username can't exceed 16 characters")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, underscores and hyphens",
		)
		.transform((uname) => uname.toLowerCase()),
	email: z
		.email("email must be included in the body")
		.trim()
		.transform((email) => email.toLowerCase()),
	password: z
		.string("password must be included in the body")
		.min(8, "Password must be at least 8 characters long")
		.max(32, "Password can't exceed 32 characters"),
});

export const loginSchema = z.object({
	usernameOrEmail: z
		.string("usernameOrEmail must be included in the body")
		.transform((val) => val.toLowerCase()),
	password: z.string("password must be included in the body"),
});
