import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import { AppContextProvider } from "@/context/AppContext.tsx";
import Register from "@/pages/Register";
import Toast from "@/components/Toast.tsx";
import Home from "@/pages/Home.tsx";
import ProtectedRoutesWrapper from "@/components/ProtectedRoutesWrapper.tsx";
import CreateGroup from "@/pages/CreateGroup.tsx";
import ROUTES from "@/constants/Routes.ts";
import GroupFeed from "@/pages/GroupFeed.tsx";
import GroupLayout from "@/components/GroupLayout.tsx";
import CreatePost from "@/pages/CreatePost.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from "@/pages/PostDetails.tsx";

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
							<Route index path={ROUTES.HOME} element={<Home />} />
							<Route path={ROUTES.CREATE_GROUP} element={<CreateGroup />} />
							<Route path={ROUTES.GROUP.BASE} element={<GroupLayout />}>
								<Route index element={<GroupFeed />} />
								<Route path={ROUTES.GROUP.CREATE_POST} element={<CreatePost />} />
							</Route>
							<Route path={ROUTES.POST_DETAILS} element={<PostDetails />} />
						</Route>
					</Routes>
				</AppContextProvider>
			</QueryClientProvider>
		</BrowserRouter>
	);
}

export default App;
