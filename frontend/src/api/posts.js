import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/posts`;

export const getAllPosts = async (username) => {
	try {
		const response = await axios.get(BASE_URL, {
			params: username ? { username: username.toLowerCase() } : {},
		});

		return response.data.posts;
	} catch (error) {
		axiosError(error, "Error fetching posts");
	}
};

export const getCurrentUserPosts = async () => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/api/me/posts`,
			headers(token),
		);

		return response.data.posts;
	} catch (error) {
		axiosError(error);
	}
};

export const getPostById = async (id) => {
	try {
		const url = `${BASE_URL}/${id}`;

		const response = await axios.get(url);

		return response.data.post;
	} catch (error) {
		axiosError(error, "Error fetching post");
	}
};

export const addNewPost = async (text) => {
	try {
		const token = useAuthStore.getState().token;
		const url = BASE_URL;

		const response = await axios.post(
			url,
			{
				text,
			},
			headers(token),
		);

		return response.data.post;
	} catch (error) {
		axiosError(error, "Error adding new post");
	}
};

export const updatePost = async ({ id, text }) => {
	try {
		const token = useAuthStore.getState().token;
		const url = `${BASE_URL}/${id}`;

		const response = await axios.patch(
			url,
			{
				text,
			},
			headers(token),
		);

		return response.data.post;
	} catch (error) {
		axiosError(error, "Error while updating post");
	}
};

export const deletePost = async (id) => {
	try {
		const token = useAuthStore.getState().token;
		const url = `${BASE_URL}/${id}`;

		const response = await axios.delete(url, headers(token));

		return response.data.post;
	} catch (error) {
		axiosError(error, "Error while deleting post");
	}
};

const axiosError = (error, fallbackMsg) => {
	const message =
		error.response?.data?.message || error.message || `${fallbackMsg}`;
	throw new Error(message);
};

const headers = (token) => {
	if (!token) return;
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};
