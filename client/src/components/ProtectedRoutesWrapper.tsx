import { useAppContext } from "@/context/AppContext.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useRefreshToken from "@/hooks/useRefreshToken.tsx";
import { useEffect, useState } from "react";
import { Comment } from "react-loader-spinner";

const ProtectedRoutesWrapper = () => {
	const { authentication } = useAppContext();
	const { refresh } = useRefreshToken();
	const location = useLocation();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authentication.accessToken) {
			void verifyRefreshToken();
		} else {
			setLoading(false);
		}
	}, []);

	const verifyRefreshToken = async () => {
		try {
			await refresh();
		} catch (error) {
			console.error(error);
			toast.error("You need to be logged in.");
			return <Navigate to={"/login"} state={{ from: location }} replace />;
		} finally {
			setLoading(false);
		}
	};

	// if (authentication.accessToken) {
	// 	return <Outlet />;
	// } else {
	// 	void verifyRefreshToken();
	// 	// toast.error("You need to be logged in.");
	// 	// return <Navigate to={"/login"} state={{ from: location }} replace />;
	// }
	return loading ? (
		<Comment
			visible={loading}
			height="80"
			width="80"
			ariaLabel="comment-loading"
			wrapperStyle={{}}
			wrapperClass="comment-wrapper"
			color="#fff"
			backgroundColor="#F4442E"
		/>
	) : (
		<Outlet />
	);
};

export default ProtectedRoutesWrapper;
