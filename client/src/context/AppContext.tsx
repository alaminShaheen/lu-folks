import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import Authentication from "@/models/Authentication.ts";

type AppContextType = {
	authentication: Authentication;
	setAuthentication: Dispatch<SetStateAction<Authentication>>;
	clearAuthentication: () => void;
};

const APP_CONTEXT_DEFAULT_VALUES: AppContextType = {
	authentication: Authentication.EMPTY,
	setAuthentication: () => {},
	clearAuthentication: () => {},
};
export const AppContext = createContext<AppContextType>(APP_CONTEXT_DEFAULT_VALUES);

type AppContextProviderProps = {
	children: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
	const { children } = props;
	const [authentication, setAuthentication] = useState(APP_CONTEXT_DEFAULT_VALUES.authentication);

	const clearAuthentication = () => {
		setAuthentication(Authentication.EMPTY);
	};

	return (
		<AppContext.Provider value={{ authentication, setAuthentication, clearAuthentication }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
