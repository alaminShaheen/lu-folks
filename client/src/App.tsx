import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import { AppContextProvider } from "@/context/AppContext.tsx";
import Register from "@/pages/Register";
import Toast from "@/components/Toast.tsx";
import NewsFeed from "@/pages/NewsFeed.tsx";
import ProtectedRoutesWrapper from "@/components/ProtectedRoutesWrapper.tsx";
import CreateGroup from "@/pages/CreateGroup.tsx";
import ROUTES from "@/constants/Routes.ts";
import GroupDetails from "@/pages/GroupDetails.tsx";

function App() {
	return (
		<AppContextProvider>
			<BrowserRouter>
				<Toast />
				<Routes>
					<Route index Component={LandingPage} />
					<Route path={ROUTES.LOGIN} Component={Login} />
					<Route path={ROUTES.REGISTER} Component={Register} />
					<Route Component={ProtectedRoutesWrapper}>
						<Route path={ROUTES.NEWS_FEED} Component={NewsFeed} />
						<Route path={ROUTES.CREATE_GROUP} Component={CreateGroup} />
						<Route path={ROUTES.GROUP.BASE}>
							<Route path={ROUTES.GROUP.DETAILS} Component={GroupDetails} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AppContextProvider>
	);
}

export default App;
