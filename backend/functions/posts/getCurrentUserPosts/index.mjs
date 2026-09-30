import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getAllPostsByUsername } from "../../../services/posts.mjs";
import { authorization } from "../../../middlewares/authentication.mjs";

export const handler = middy(async (event) => {
	const username = event.user.username;

	const posts = await getAllPostsByUsername(username);

	return sendResponse(200, {
		success: true,
		message: "Successfully fetched all posts for the current user",
		posts,
	});
})
	.use(authorization())
	.use(errorHandler());
