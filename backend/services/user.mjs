import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./db.mjs";

export const getUser = async (username) => {
	const command = new GetCommand({
		TableName: process.env.TABLE_NAME,
		Key: {
			PK: `USER#${username}`,
			SK: "PROFILE",
		},
	});

	const result = await db.send(command);
	return result.Item || null;
};
