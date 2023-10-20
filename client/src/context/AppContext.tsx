import { createContext, ReactNode } from "react";

type AppContextType = { auth: string };

const APP_CONTEXT_DEFAULT_VALUES: AppContextType = { auth: "" };
export const AppContext = createContext<AppContextType | null>(APP_CONTEXT_DEFAULT_VALUES);

type AppContextProviderProps = {
	children: ReactNode;
};

const AppContextProvider = (props: AppContextProviderProps) => {
	const { children } = props;

	return <AppContext.Provider value={{ auth: "" }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
