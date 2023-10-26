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
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import User from "@/models/User.ts";
import { USER_ROUTES } from "@/constants/ApiRoutes.ts";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type AppContextType = {
	authentication: Authentication;
	setAuthentication: Dispatch<SetStateAction<Authentication>>;
	appLoading: boolean;
	setAppLoading: Dispatch<SetStateAction<boolean>>;
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	clearAuthentication: () => void;
	getCurrentUser: (authData: Authentication) => Promise<void>;
};

const APP_CONTEXT_DEFAULT_VALUES: AppContextType = {
	authentication: Authentication.EMPTY,
	setAuthentication: () => {},
	appLoading: false,
	setAppLoading: () => {},
	user: null,
	setUser: () => {},
	clearAuthentication: () => {},
	getCurrentUser: async () => {},
};
export const AppContext = createContext<AppContextType>(APP_CONTEXT_DEFAULT_VALUES);

type AppContextProviderProps = {
	children: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
	const { children } = props;
	const [authentication, setAuthentication] = useState(APP_CONTEXT_DEFAULT_VALUES.authentication);
	const [appLoading, setAppLoading] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const { privateAxiosInstance } = useAxiosInstance();

	const clearAuthentication = useCallback(() => {
		setAuthentication(Authentication.EMPTY);
		setUser(null);
	}, []);

	const getCurrentUser = useCallback(
		async () => {
			try {
				setAppLoading(true);
				const { data } = await privateAxiosInstance.get<User>(USER_ROUTES.CURRENT_USER);
				setUser(data);
			} catch (error: any) {
				toast.dismiss();
				if (error instanceof AxiosError) {
					toast.error(error.response?.data.message);
				} else {
					toast.error(error.message);
				}
			} finally {
				setAppLoading(false);
			}
		},
		[privateAxiosInstance]
	);

	useEffect(() => {
		if (authentication.accessToken && !user) {
			void getCurrentUser();
		}
	}, [authentication.accessToken, getCurrentUser, user]);

	return (
		<AppContext.Provider
			value={{
				authentication,
				setAuthentication,
				clearAuthentication,
				user,
				setAppLoading,
				appLoading,
				getCurrentUser,
				setUser
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
