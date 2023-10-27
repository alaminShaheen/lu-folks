import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { HTMLAttributes, useCallback } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import User from "@/models/User";
import ROUTES from "@/constants/Routes.ts";
import APILinks from "@/constants/APILinks.ts";
import UserAvatar from "@/components/ui/UserAvatar.tsx";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

interface UserAccountNavProps extends HTMLAttributes<HTMLDivElement> {
	user: User;
}

export function UserAccountNav(props: UserAccountNavProps) {
	const { user } = props;
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const { clearAuthentication } = useAppContext();
	const navigate = useNavigate();

	const logout = useCallback(async () => {
		try {
			await axiosInstance.delete(APILinks.logout());
			clearAuthentication();
			toast.dismiss();
			toast.success("You have logged out successfully.");
			navigate("/login");
		} catch (error: any) {
			toast.dismiss();
			console.log(error);
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
			} else {
				toast.error(error.message);
			}
		}
	}, [axiosInstance, clearAuthentication, navigate]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<UserAvatar username={user.username} imageUrl={user.imageUrl} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-white" align="end">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-1 leading-none">
						{user.username && <p className="font-medium">{user.username}</p>}
						<p className="w-[200px] truncate text-sm text-muted-foreground">
							{user.email}
						</p>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to={ROUTES.NEWS_FEED}>Feed</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link to={ROUTES.CREATE_GROUP}>Create Group</Link>
				</DropdownMenuItem>

				{/*<DropdownMenuItem asChild>*/}
				{/*	<Link to={ROUTES}>Settings</Link>*/}
				{/*</DropdownMenuItem>*/}
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer" onSelect={logout}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
