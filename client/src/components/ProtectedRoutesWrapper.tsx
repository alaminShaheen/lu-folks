import { toast } from "react-toastify";
import { Comment } from "react-loader-spinner";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout.tsx";
import ROUTES from "@/constants/Routes.ts";
import useRefreshToken from "@/hooks/useRefreshToken.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const ProtectedRoutesWrapper = () => {
	const { authentication, setAuthentication } = useAppContext();
	const { refresh } = useRefreshToken();
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const verifyRefreshToken = useCallback(async () => {
		try {
			const accessToken = await refresh();
			setAuthentication((prev) => ({ ...prev, accessToken }));
		} catch (error) {
			console.error(error);
			toast.error("You need to be logged in.");
			navigate(ROUTES.LOGIN, { replace: true, state: { from: location } });
		} finally {
			setLoading(false);
		}
	}, [location, navigate, refresh, setAuthentication]);

	useEffect(() => {
		if (!authentication.accessToken) {
			void verifyRefreshToken();
		} else {
			setLoading(false);
		}
	}, [authentication.accessToken, verifyRefreshToken]);

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
		<PageLayout>
			<Outlet />
		</PageLayout>
	);
};

export default ProtectedRoutesWrapper;
