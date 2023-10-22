import { useAppContext } from "@/context/AppContext.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoutesWrapper = () => {
	const { authentication } = useAppContext();
	const location = useLocation();

	if (authentication.accessToken) {
		return <Outlet />;
	} else {
		toast.error("You need to be logged in.");
		return <Navigate to={"/login"} state={{ from: location }} replace />;
	}
};

export default ProtectedRoutesWrapper;
