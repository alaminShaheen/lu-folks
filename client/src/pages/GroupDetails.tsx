import { Fragment } from "react";
import { useParams } from "react-router-dom";
import PostFeed from "@/components/PostFeed.tsx";
import handleError from "@/utils/handleError.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import MiniCreatePost from "@/components/MiniCreatePost.tsx";
import useFetchGroupDetails from "@/hooks/group/useFetchGroupDetails.tsx";

const GroupDetails = () => {
	const params = useParams<"slug">();
	const {
		data: group,
		isFetching: fetchingGroup,
		isError: fetchGroupIsError,
		error: fetchGroupError,
	} = useFetchGroupDetails(params.slug!);

	// console.log(group?.posts);

	if (fetchGroupIsError) {
		handleError(fetchGroupError);
	}

	// console.log(group?.posts.map(post => post.title));

	return (
		<Fragment>
			{fetchingGroup || !group ? (
				<Skeleton className="rounded h-11 w-1/2" />
			) : (
				<h1 className="font-bold text-3xl md:text-4xl h-14">{group.title}</h1>
			)}

			<MiniCreatePost />
			{/*	Show posts*/}

			{fetchingGroup || !group ? (
				<div>Loading...</div>
			) : (
				<PostFeed
					initialPosts={group.posts}
					groupInfo={{
						id: group.id,
						title: group.title,
						createdAt: group.createdAt,
						creatorId: group.creator.id,
						updatedAt: group.updatedAt,
					}}
				/>
			)}
		</Fragment>
	);
};

export default GroupDetails;
