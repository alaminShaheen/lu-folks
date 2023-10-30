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
import GroupLayout from "@/components/GroupLayout.tsx";
import CreatePost from "@/pages/CreatePost.tsx";
import { GroupContextProvider } from "@/context/GroupContext.tsx";

function App() {
	return (
		<AppContextProvider>
			<GroupContextProvider>
				<BrowserRouter>
					<Toast />
					<Routes>
						<Route index Component={LandingPage} />
						<Route path={ROUTES.LOGIN} Component={Login} />
						<Route path={ROUTES.REGISTER} Component={Register} />
						<Route Component={ProtectedRoutesWrapper}>
							<Route path={ROUTES.NEWS_FEED} Component={NewsFeed} />
							<Route path={ROUTES.CREATE_GROUP} Component={CreateGroup} />

							<Route path={ROUTES.GROUP.BASE} Component={GroupLayout}>
								<Route index path={ROUTES.GROUP.DETAILS} Component={GroupDetails} />
								<Route path={ROUTES.GROUP.CREATE_POST} Component={CreatePost} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</GroupContextProvider>
		</AppContextProvider>
	);
}

export default App;
