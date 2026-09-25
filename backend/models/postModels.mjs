import { z } from "zod";

export const postSchema = z.object({
	text: z
		.string()
		.trim()
		.min(3, "Post text needs to be at least 3 characters long"),
});
