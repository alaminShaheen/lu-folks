import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { AUTH_ROUTES } from "@/constants/ApiRoutes.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.tsx";

const NewsFeed = () => {
	const [loading, setLoading] = useState(false);
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const { clearAuthentication } = useAppContext();
	const navigate = useNavigate();

	const logout = useCallback(async () => {
		try {
			setLoading(true);
			await axiosInstance.delete(AUTH_ROUTES.LOGOUT);
			clearAuthentication();
			toast.dismiss();
			toast.success("You have logged out successfully.");
			navigate("/login");
		} catch (error: any) {
			toast.dismiss();
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, navigate, toast]);

	return (
		<div className="flex justify-center items-center container h-screen">
			Welcome to your newsfeed!!
			<Button onClick={logout} disabled={loading}>
				Logout
			</Button>
		</div>
	);
};

export default NewsFeed;
