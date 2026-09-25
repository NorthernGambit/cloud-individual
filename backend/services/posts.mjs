import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { db } from "./db.mjs";

export const createPost = async (text, username) => {
	const postId = randomUUID();
	const isoDate = new Date().toISOString();

	const newPost = {
		PK: `POST#${postId}`,
		SK: "META",
		GSI1PK: `USER#${username}`,
		GSI1SK: isoDate,
		GSI2PK: "POSTS",
		GSI2SK: isoDate,
		id: postId,
		username,
		createdAt: isoDate,
		text,
	};

	const command = new PutCommand({
		TableName: process.env.TABLE_NAME,
		Item: newPost,
		ConditionExpression: "attribute_not_exists(PK)",
	});

	await db.send(command);

	return {
		id: postId,
		username,
		createdAt: isoDate,
		text,
	};
};

export const getAllPosts = async () => {
	const command = new QueryCommand({
		TableName: process.env.TABLE_NAME,
		IndexName: "GSI2",
		KeyConditionExpression: "GSI2PK = :gsi2pk",
		ExpressionAttributeValues: {
			":gsi2pk": "POSTS",
		},
		ScanIndexForward: false,
	});

	const { Items } = await db.send(command);

	const result = Items.map((item) => formatPost(item));

	return result;
};

const formatPost = (rawPost) => {
	const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...formattedPost } =
		rawPost;
	return formattedPost;
};
