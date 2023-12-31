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
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import { useTheme } from "@/context/ThemeContext.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { privateAxiosInstance } from "@/api/Axios.ts";

interface UserAccountNavProps extends HTMLAttributes<HTMLDivElement> {
	user: User;
}

export function UserAccountNav(props: UserAccountNavProps) {
	const { user } = props;
	const { clearAuthentication } = useAppContext();
	const { setTheme, theme } = useTheme();
	const navigate = useNavigate();

	const logout = useCallback(async () => {
		try {
			await privateAxiosInstance.delete(APILinks.logout());
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
	}, [clearAuthentication, navigate]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<UserAvatar username={user.username} imageUrl={user.imageUrl} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="" align="end">
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
					<Link to={ROUTES.HOME}>Feed</Link>
				</DropdownMenuItem>

				<DropdownMenuItem
					asChild
					onClick={(event) => {
						event.preventDefault();
					}}
				>
					<div
						className="flex items-center space-x-2 justify-between"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						<Label htmlFor="airplane-mode">
							{theme === "dark" ? "Light mode" : "Dark mode"}
						</Label>
						<Switch
							id="theme"
							checked={theme === "dark"}
							onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
						/>
					</div>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link to={ROUTES.CREATE_GROUP}>Create Group</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link to={`profile/${user.id}`}>Profile</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer" onSelect={logout}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
