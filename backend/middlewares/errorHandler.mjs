import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
	onError: (handler) => {
		const error = handler.error;
		console.error("Error: ", error);

		handler.response = sendResponse(error.statusCode || 500, {
			success: false,
			message: error.message || "Internal server error!",
		});
	},
});
