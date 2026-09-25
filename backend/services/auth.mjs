import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { hashPassword } from "../utils/bcrypt.mjs";
import { db } from "./db.mjs";
import createError from "http-errors";

export const registerUser = async (username, email, password) => {
	const newUser = {
		PK: `USER#${username}`,
		SK: "PROFILE",
		username,
		email,
		passwordHash: await hashPassword(password),
		createdAt: new Date().toISOString(),
	};

	// command to batch write to dynamodb, if any fail nothing gets written to the db
	const command = new TransactWriteCommand({
		TransactItems: [
			// main user profile write
			{
				Put: {
					TableName: process.env.TABLE_NAME,
					Item: newUser,
					ConditionExpression: "attribute_not_exists(PK)",
				},
			},
			// email reservation write
			{
				Put: {
					TableName: process.env.TABLE_NAME,
					Item: {
						PK: `EMAIL#${email}`,
						SK: `EMAIL`,
						username,
					},
					ConditionExpression: "attribute_not_exists(PK)",
				},
			},
		],
	});

	// try catch block to give more detailed information if username and/or email is already taken
	try {
		await db.send(command);

		const safeUser = {
			username: newUser.username,
			email: newUser.email,
			createdAt: newUser.createdAt,
		};

		return safeUser;
	} catch (error) {
		// AI helped me figure out the syntax for what dynamodb sends back as a result from the transact write command
		if (error.name === "TransactionCanceledException") {
			const reasons = error.CancellationReasons;

			const usernameTaken =
				reasons?.[0]?.Code === "ConditionalCheckFailed";
			const emailTaken = reasons?.[1]?.Code === "ConditionalCheckFailed";

			if (usernameTaken && emailTaken) {
				throw createError(409, "Username and email are both taken");
			} else if (usernameTaken) {
				throw createError(409, "Username is taken");
			} else if (emailTaken) {
				throw createError(409, "Email is taken");
			}
		}

		// if the error is anything else a generic error is thrown which gets translated to a 500 internal server error by the errorHandler
		throw error;
	}
};
