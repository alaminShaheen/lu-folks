import { Link } from "react-router-dom";
import ROUTES from "@/constants/Routes.ts";
import AppLogo from "@/components/AppLogo.tsx";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { UserAccountNav } from "@/components/UserAccountNav.tsx";

const Navbar = () => {
	const { user } = useAppContext();
	return (
		<div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
			<div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
				{/* logo */}
				<Link to={ROUTES.HOME} className="flex gap-2 items-center">
					<AppLogo />
					<p className="hidden text-zinc-700 text-sm font-medium md:block">LU Folks</p>
				</Link>

				{/* search bar */}
				{/*<SearchBar />*/}

				{/* actions */}
				{user ? (
					<UserAccountNav user={user} />
				) : (
					<ButtonLink to={ROUTES.LOGIN}>Sign In</ButtonLink>
					// <Button variant="secondary">
					// 	<Link >
					// 	</Link>
					// </Button>
				)}
			</div>
		</div>
	);
};

export default Navbar;
