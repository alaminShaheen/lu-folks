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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
	return (
		<BrowserRouter>
			<Toast />
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools />
				<AppContextProvider>
					<Routes>
						<Route index element={<LandingPage />} />
						<Route path={ROUTES.LOGIN} element={<Login />} />
						<Route path={ROUTES.REGISTER} element={<Register />} />
						<Route element={<ProtectedRoutesWrapper />}>
							<Route index path={ROUTES.NEWS_FEED} element={<NewsFeed />} />
							<Route path={ROUTES.CREATE_GROUP} element={<CreateGroup />} />
							<Route path={ROUTES.GROUP.BASE} element={<GroupLayout />}>
								<Route index element={<GroupDetails />} />
								<Route path={ROUTES.GROUP.CREATE_POST} element={<CreatePost />} />
							</Route>
						</Route>
					</Routes>
				</AppContextProvider>
			</QueryClientProvider>
		</BrowserRouter>
	);
}

export default App;
