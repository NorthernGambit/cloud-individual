import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const login = async ({ usernameOrEmail, password }) => {
	try {
		const body = {
			usernameOrEmail,
			password,
		};

		const URL = `${BASE_URL}/login`;

		const response = await axios.post(URL, body);

		return { token: response.data.token, username: response.data.username };
	} catch (error) {
		const message =
			error.response?.data?.message ||
			error.message ||
			"An error occurred while logging in";
		throw new Error(message);
	}
};

export const register = async ({ username, email, password }) => {
	try {
		const url = `${BASE_URL}/register`;

		const response = await axios.post(url, { username, email, password });

		return response.data;
	} catch (error) {
		const message =
			error.response?.data?.message ||
			error.message ||
			"An error occurred while registering user";
		throw new Error(message);
	}
};
