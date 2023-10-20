import { Link } from "react-router-dom";
import { Button } from "../components/ui/button.tsx";

const LandingPage = () => {
	return (
		<div className="text-7xl font-bold bg-zinc-900 text-blue-700 h-screen flex flex-col justify-center items-center">
			<span>Landing page of LU Folks</span>
			<div>
				<Link to="/login" className="underline underline-offset-4 hover:text-primary">
					<Button variant="secondary">Sign in!</Button>
				</Link>
				<Link
					to="/register"
					className="underline underline-offset-4 hover:text-primary ml-3"
				>
					<Button variant="secondary">Sign up!</Button>
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;
