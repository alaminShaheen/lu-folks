import { useRouteError } from "react-router-dom";

const NotFound = () => {
	const error = useRouteError() as { message: string; statusText: number };
	console.error(error);

	return (
		<div className="h-screen flex flex-col items-center justify-center gap-10">
			<h1 className="text-5xl font-bold">Oops!</h1>
			<p className="">Sorry, an unexpected error has occurred.</p>
			<p className="text-gray-400">
				<i>{error.message || error.statusText}</i>
			</p>
		</div>
	);
};

export default NotFound;
