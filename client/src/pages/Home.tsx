import { Fragment } from "react";
import { Home as HomeIcon, Users } from "lucide-react";
import ROUTES from "@/constants/Routes.ts";
import PostFeed from "@/components/PostFeed.tsx";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import SuggestedGroupsList from "@/components/SuggestedGroupsList.tsx";
import SideSectionWrapper from "@/components/SideSectionWrapper.tsx";

const Home = () => {
	return (
		<Fragment>
			<h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
				<PostFeed />
				<div className="space-y-6">
					<SideSectionWrapper
						title="Home"
						icon={<HomeIcon className="h-4 w-4" />}
						description="Your LU Folks frontpage. Come here to check in with your
									favorite groups."
					>
						<ButtonLink className="w-full" to={ROUTES.CREATE_GROUP}>
							Create Group
						</ButtonLink>
					</SideSectionWrapper>
					<SideSectionWrapper
						title="Suggested Groups"
						icon={<Users className="h-4 w-4" />}
						description="Connect with users and posts of new groups here."
					>
						<SuggestedGroupsList />
					</SideSectionWrapper>
				</div>
			</div>
		</Fragment>
	);
};

export default Home;
