import {
	DeleteCommand,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { db } from "./db.mjs";
import createError from "http-errors";

const TableName = process.env.TABLE_NAME;

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
		TableName,
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
		TableName,
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

export const getAllPostsByUsername = async (username) => {
	const command = new QueryCommand({
		TableName,
		IndexName: "GSI1",
		KeyConditionExpression: "GSI1PK = :gsi1pk",
		ExpressionAttributeValues: {
			":gsi1pk": `USER#${username}`,
		},
		ScanIndexForward: false,
	});

	const { Items } = await db.send(command);

	const result = Items.map((item) => formatPost(item));

	return result;
};

export const getPostById = async (id) => {
	const command = new GetCommand({
		TableName,
		Key: {
			PK: `POST#${id}`,
			SK: "META",
		},
	});

	const { Item } = await db.send(command);

	if (!Item) throw createError(404, "No post with corresponding id found");

	return formatPost(Item);
};

export const updatePost = async (id, username, newText) => {
	await verifyPostOwnership(id, username);

	const command = new UpdateCommand({
		TableName,
		Key: {
			PK: `POST#${id}`,
			SK: "META",
		},
		// text apparently is a reserved word so I use ExpressionAttributeNames to get around it
		UpdateExpression: "SET #postText = :text, updatedAt = :updatedAt",
		ExpressionAttributeNames: {
			"#postText": "text",
		},
		ExpressionAttributeValues: {
			":text": newText,
			":updatedAt": new Date().toISOString(),
		},
		ConditionExpression: "attribute_exists(PK)",
		ReturnValues: "ALL_NEW",
	});

	const { Attributes: updatedPost } = await db.send(command);

	return formatPost(updatedPost);
};

export const deletePost = async (id, username) => {
	const post = await verifyPostOwnership(id, username);

	const command = new DeleteCommand({
		TableName,
		Key: {
			PK: `POST#${id}`,
			SK: "META",
		},
	});

	await db.send(command);

	return post;
};

const verifyPostOwnership = async (id, username) => {
	const post = await getPostById(id);

	if (post.username !== username)
		throw createError(
			403,
			"You do not have permission to modify this post",
		);

	return post;
};

const formatPost = (rawPost) => {
	const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...formattedPost } =
		rawPost;
	return formattedPost;
};
