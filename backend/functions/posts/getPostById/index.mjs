import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getPostById } from "../../../services/posts.mjs";
import createError from "http-errors";

export const handler = middy(async (event) => {
	const id = event.pathParameters?.id;

	if (!id) throw createError(400, "No valid Id provided");

	const post = await getPostById(id);

	return sendResponse(200, {
		success: true,
		message: "Successfully fetched post with corresponding id",
		post,
	});
}).use(errorHandler());
