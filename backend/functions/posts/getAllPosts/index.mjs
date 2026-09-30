import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import {
	getAllPosts,
	getAllPostsByUsername,
} from "../../../services/posts.mjs";

export const handler = middy(async (event) => {
	const username = event.queryStringParameters?.username;

	const posts = username
		? await getAllPostsByUsername(username.toLowerCase())
		: await getAllPosts();

	return sendResponse(200, {
		success: true,
		message: username
			? `Successfully fetched all post by user: ${username}`
			: "Successfully fetched all posts",
		posts,
	});
}).use(errorHandler());
