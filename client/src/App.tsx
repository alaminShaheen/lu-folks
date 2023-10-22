import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import { AppContextProvider } from "@/context/AppContext.tsx";
import Register from "@/pages/Register";
import Toast from "@/components/Toast.tsx";
import NewsFeed from "@/pages/NewsFeed.tsx";
import ProtectedRoutesWrapper from "@/components/ProtectedRoutesWrapper.tsx";

function App() {
	return (
		<AppContextProvider>
			<BrowserRouter>
				<Toast />
				<Routes>
					<Route index Component={LandingPage} />
					<Route path="/login" Component={Login} />
					<Route path="/register" Component={Register} />
					<Route Component={ProtectedRoutesWrapper}>
						<Route path="/news-feed" Component={NewsFeed} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AppContextProvider>
	);
}

export default App;
