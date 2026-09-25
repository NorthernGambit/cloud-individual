import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { authorization } from "../../../middlewares/authentication.mjs";
import { postSchema } from "../../../models/postModels.mjs";
import { createPost } from "../../../services/posts.mjs";

export const handler = middy(async (event) => {
	const { text } = event.body;
	const { username } = event.user;

	const post = await createPost(text, username);

	return sendResponse(201, {
		success: true,
		message: "Notice post successfully created",
		post,
	});
})
	.use(jsonBodyParser())
	.use(authorization())
	.use(validateBody(postSchema))
	.use(errorHandler());
