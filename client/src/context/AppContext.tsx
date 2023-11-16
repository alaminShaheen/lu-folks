import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import Authentication from "@/models/Authentication.ts";
import User from "@/models/User.ts";
import useFetchCurrentUser from "@/hooks/auth/useFetchCurrentUser.tsx";
import handleError from "@/utils/handleError.ts";
import { privateAxiosInstance, publicAxiosInstance } from "@/api/Axios.ts";
import httpStatus from "http-status";
import { AxiosInstance } from "axios";
import useRefreshToken from "@/hooks/useRefreshToken.tsx";

type AppContextType = {
	authentication: Authentication;
	setAuthentication: Dispatch<SetStateAction<Authentication>>;
	appLoading: boolean;
	setAppLoading: Dispatch<SetStateAction<boolean>>;
	user: User | null;
	clearAuthentication: () => void;
	publicAxiosInstance: AxiosInstance;
	privateAxiosInstance: AxiosInstance;
};

const APP_CONTEXT_DEFAULT_VALUES: AppContextType = {
	authentication: Authentication.EMPTY,
	setAuthentication: () => {},
	appLoading: false,
	setAppLoading: () => {},
	user: null,
	clearAuthentication: () => {},
	// getCurrentUser: async () => {},
	privateAxiosInstance,
	publicAxiosInstance,
};
export const AppContext = createContext<AppContextType>(APP_CONTEXT_DEFAULT_VALUES);

type AppContextProviderProps = {
	children: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
	const { children } = props;
	const [authentication, setAuthentication] = useState(APP_CONTEXT_DEFAULT_VALUES.authentication);
	const [appLoading, setAppLoading] = useState(false);
	const { refresh } = useRefreshToken();

	const clearAuthentication = useCallback(() => {
		setAuthentication(Authentication.EMPTY);
		// setUser(null);
	}, []);

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
			}
		);

		return () => {
			privateAxiosInstance.interceptors.request.eject(requestIntercept);
			privateAxiosInstance.interceptors.response.eject(responseIntercept);
		};
	}, [authentication.accessToken]);

	const {
		data: user,
		isFetching,
		isError,
		error,
	} = useFetchCurrentUser({ accessToken: authentication.accessToken });

	if (isError) {
		handleError(error);
	}

	return (
		<AppContext.Provider
			value={{
				authentication,
				setAuthentication,
				clearAuthentication,
				user: user || null,
				setAppLoading,
				appLoading,
				// getCurrentUser,
				publicAxiosInstance,
				privateAxiosInstance
			}}
		>
			{isFetching ? <div>Loading....</div> : children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
