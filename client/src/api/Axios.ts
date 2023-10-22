import axios from "axios";
import FieldValidationError from "@/models/FieldValidationError.ts";
import HttpError from "@/models/HttpError.ts";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error: any) => {
		if ("validationErrors" in error.response.data) {
			return Promise.reject(
				new FieldValidationError(
					error.response.data.status,
					error.response.data.validationErrors,
					error.response.data.message,
				),
			);
		} else {
			return Promise.reject(
				new HttpError(error.response.data.status, error.response.data.message),
			);
		}
	},
);

export default axiosInstance;
