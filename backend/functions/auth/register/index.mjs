import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { registerSchema } from "../../../models/authModels.mjs";

export const handler = middy(async (event) => {
	const { username, email, password } = event.body;

	const user = registerUser(username, email, password);

	return sendResponse(200, {
		success: true,
		message: "Account succesfully registered",
		user,
	});
})
	.use(jsonBodyParser())
	.use(validateBody(registerSchema))
	.use(errorHandler());
