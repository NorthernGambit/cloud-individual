import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import createError from "http-errors";
import { authorization } from "../../../middlewares/authentication.mjs";
import { deletePost } from "../../../services/posts.mjs";

export const handler = middy(async (event) => {
	const id = event.pathParameters?.id;
	const username = event.user.username;

	if (!id) throw createError(400, "No valid Id provided");

	const deletedPost = await deletePost(id, username);

	return sendResponse(200, {
		success: true,
		message: "Successfully deleted post with corresponding id",
		post: deletedPost,
	});
})
	.use(authorization())
	.use(errorHandler());
