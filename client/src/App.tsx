import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import Register from "@/pages/Register.tsx";
import LandingPage from "@/pages/LandingPage.tsx";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index Component={LandingPage} />
				<Route path="/login" Component={Login} />
				<Route path="/register" Component={Register} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
