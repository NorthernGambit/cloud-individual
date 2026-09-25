import jwt from "jsonwebtoken";
import createError from "http-errors";

export const signToken = (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});

	return token;
};

export const verifyToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		return decoded;
	} catch (error) {
		throw createError(401, "Invalid token");
	}
};
