import createError from "http-errors";
import { verifyToken } from "../utils/jwt.mjs";

export const authorization = () => ({
	before: (handler) => {
		const authHeader =
			handler.event.headers?.authorization ||
			handler.event.headers?.Authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new createError(
				401,
				"Missing or invalid authorization header",
			);
		}

		const token = authHeader.split(" ")[1];

		handler.event.user = verifyToken(token);
	},
});
