import axios from "axios";

export const publicAxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export const privateAxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
