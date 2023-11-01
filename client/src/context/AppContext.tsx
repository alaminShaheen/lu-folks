import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useContext,
	useState,
} from "react";
import Authentication from "@/models/Authentication.ts";
import User from "@/models/User.ts";
import useFetchCurrentUser from "@/hooks/auth/useFetchCurrentUser.tsx";
import handleError from "@/utils/handleError.ts";

type AppContextType = {
	authentication: Authentication;
	setAuthentication: Dispatch<SetStateAction<Authentication>>;
	appLoading: boolean;
	setAppLoading: Dispatch<SetStateAction<boolean>>;
	user: User | null;
	clearAuthentication: () => void;
};

const APP_CONTEXT_DEFAULT_VALUES: AppContextType = {
	authentication: Authentication.EMPTY,
	setAuthentication: () => {},
	appLoading: false,
	setAppLoading: () => {},
	user: null,
	clearAuthentication: () => {},
	// getCurrentUser: async () => {},
};
export const AppContext = createContext<AppContextType>(APP_CONTEXT_DEFAULT_VALUES);

type AppContextProviderProps = {
	children: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
	const { children } = props;
	const [authentication, setAuthentication] = useState(APP_CONTEXT_DEFAULT_VALUES.authentication);
	const [appLoading, setAppLoading] = useState(false);
	// const [, setUser] = useState<User | null>(null);

	const clearAuthentication = useCallback(() => {
		setAuthentication(Authentication.EMPTY);
		// setUser(null);
	}, []);

	const {
		data: user,
		isFetching,
		isError,
		error,
	} = useFetchCurrentUser({ accessToken: authentication.accessToken });

	if (isError) {
		handleError(error);
	}

	return isFetching ? (
		<div>Loading....</div>
	) : (
		<AppContext.Provider
			value={{
				authentication,
				setAuthentication,
				clearAuthentication,
				user: user || null,
				setAppLoading,
				appLoading,
				// getCurrentUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
