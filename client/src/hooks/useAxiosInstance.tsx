import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext.tsx";
import httpStatus from "http-status";
import useRefreshToken from "@/hooks/useRefreshToken.tsx";
import { privateAxiosInstance, publicAxiosInstance } from "@/api/Axios.ts";

const UseAxiosInstance = () => {
	const { authentication } = useAppContext();
	const { refresh } = useRefreshToken();

	useEffect(() => {
		const requestIntercept = privateAxiosInstance.interceptors.request.use(
			(config) => {
				if (!config.headers["authorization"]) {
					config.headers["authorization"] = `Bearer ${authentication.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		const responseIntercept = privateAxiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const previousRequestConfig = error?.config;
				if (
					[httpStatus.FORBIDDEN, httpStatus.UNAUTHORIZED].includes(
						error?.response?.status,
					) &&
					!previousRequestConfig?.sent
				) {
					previousRequestConfig.sent = true;
					const newAccessToken = await refresh();
					previousRequestConfig.headers["authorization"] = `Bearer ${newAccessToken}`;
					return privateAxiosInstance(previousRequestConfig);
				}
				return Promise.reject(error);
			},
		);

		return () => {
			privateAxiosInstance.interceptors.request.eject(requestIntercept);
			privateAxiosInstance.interceptors.response.eject(responseIntercept);
		};
	}, [authentication, refresh]);

	return {
		publicAxiosInstance,
		privateAxiosInstance,
	};
};

export default UseAxiosInstance;
