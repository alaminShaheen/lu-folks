import ButtonLink from "@/components/ui/ButtonLink.tsx";

const LandingPage = () => {
	return (
		<div className="text-7xl font-bold bg-zinc-900 text-blue-700 h-screen flex flex-col justify-center items-center">
			<span>Landing page of LU Folks</span>
			<div>
				<ButtonLink to="/login" className="underline underline-offset-4 hover:text-primary">
					Sign in!
				</ButtonLink>
				<ButtonLink
					to="/register"
					className="underline underline-offset-4 hover:text-primary ml-3"
				>
					Sign up!
				</ButtonLink>
			</div>
		</div>
	);
};

export default LandingPage;
