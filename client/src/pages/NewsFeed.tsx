import { Home } from "lucide-react";
import ROUTES from "@/constants/Routes.ts";
import ButtonLink from "@/components/ui/ButtonLink.tsx";

const NewsFeed = () => {
	// return (
	// 	<div className="flex justify-center items-center container h-screen">
	// 		Welcome to your newsfeed!!
	// 		<Button onClick={logout} disabled={loading}>
	// 			Logout
	// 		</Button>
	// 	</div>
	// );
	return (
		<>
			<h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6 justify-between">
				{/*{session ? <CustomFeed /> : <GeneralFeed />}*/}
				<h1 className="">You news feed</h1>
				{/* subreddit info */}
				<div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
					<div className="bg-emerald-100 px-6 py-4">
						<p className="font-semibold py-3 flex items-center gap-1.5">
							<Home className="h-4 w-4" />
							Home
						</p>
					</div>
					<dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
						<div className="flex justify-between gap-x-4 py-3">
							<p className="text-zinc-500">
								Your LU Folks frontpage. Come here to check in with your favorite
								groups.
							</p>
						</div>
						<ButtonLink className="w-full" to={ROUTES.CREATE_GROUP}>
							Create Group
						</ButtonLink>
					</dl>
				</div>
			</div>
		</>
	);
};

export default NewsFeed;
