import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { loginSchema } from "../../../models/authModels.mjs";
import { loginUser } from "../../../services/auth.mjs";

export const handler = middy(async (event) => {
	const { usernameOrEmail, password } = event.body;

	const token = await loginUser(usernameOrEmail, password);

	return sendResponse(200, {
		success: true,
		message: "User successfully logged in",
		token,
	});
})
	.use(jsonBodyParser())
	.use(validateBody(loginSchema))
	.use(errorHandler());
