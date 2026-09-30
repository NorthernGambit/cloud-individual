import { z } from "zod";

export const postSchema = z.object({
	text: z
		.string("text must be included in the body")
		.trim()
		.min(3, "Post text needs to be at least 3 characters long")
		.max(200, "Post can't exceed 200 characters"),
});
