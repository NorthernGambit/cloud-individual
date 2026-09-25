import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getAllPosts } from "../../../services/posts.mjs";

export const handler = middy(async () => {
	const posts = await getAllPosts();

	return sendResponse(200, {
		success: true,
		message: "Successfully fetched all posts",
		posts,
	});
}).use(errorHandler());
