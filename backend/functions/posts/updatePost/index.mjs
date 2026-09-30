import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import createError from "http-errors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { postSchema } from "../../../models/postModels.mjs";
import { authorization } from "../../../middlewares/authentication.mjs";
import { updatePost } from "../../../services/posts.mjs";

export const handler = middy(async (event) => {
	const id = event.pathParameters?.id;
	const username = event.user.username;
	const { text } = event.body;

	if (!id) throw createError(400, "No valid Id provided");

	const updatedPost = await updatePost(id, username, text);

	return sendResponse(200, {
		success: true,
		message: "Successfully updated post with corresponding id",
		post: updatedPost,
	});
})
	.use(jsonBodyParser())
	.use(authorization())
	.use(validateBody(postSchema))
	.use(errorHandler());
