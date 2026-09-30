import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
	onError: (handler) => {
		const error = handler.error;
		const statusCode = error.statusCode || 500;
		console.error("Error: ", error);

		handler.response = sendResponse(statusCode, {
			success: false,
			message:
				error.statusCode < 500
					? error.message
					: "Internal server error!",
		});
	},
});
