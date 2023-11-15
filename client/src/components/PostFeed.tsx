import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import Post from "@/components/Post.tsx";
import ExtendedPost from "@/models/ExtendedPost.ts";
import ReactionType from "@/models/enums/ReactionType.ts";
import ListPostSkeleton from "@/components/skeletons/ListPostSkeleton.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import useFetchPaginatedPosts from "@/hooks/post/useFetchPaginatedPosts.tsx";

type PostFeedProps = {
	initialPosts: ExtendedPost[];
	groupSlug?: string;
};
const PostFeed = (props: PostFeedProps) => {
	const { initialPosts, groupSlug } = props;
	const { user } = useAppContext();
	const lastPostContainerRef = useRef<HTMLLIElement>(null);
	const { ref: lastPostRef, entry } = useIntersection({
		root: lastPostContainerRef.current,
		threshold: 1,
	});

	const {
		data: postData,
		fetchNextPage,
		isFetchingNextPage,
		isLoading,
	} = useFetchPaginatedPosts({ initialPosts, groupSlug });

	useEffect(() => {
		if (entry?.isIntersecting) {
			void fetchNextPage(); // Load more posts when the last post comes into view
		}
	}, [entry, fetchNextPage]);

	const posts =
		postData && postData.pages.flatMap.length > 0
			? postData.pages.flatMap((page) => page)
			: initialPosts;

	if (isLoading) {
		return new Array(5).fill(<ListPostSkeleton />).map((skeleton) => skeleton);
	}

	return (
		<ul className="flex flex-col col-span-2 space-y-6 list-none">
			{posts.length > 0 ? (
				posts.map((post, index) => {
					const likes = post.postReactions.filter(
						(reaction) => reaction.type === ReactionType.LIKE,
					).length;
					const unlikes = post.postReactions.filter(
						(reaction) => reaction.type === ReactionType.UNLIKE,
					).length;
					const ownReaction = post.postReactions.find(
						(reaction) => reaction.userId === user?.id,
					)?.type;
					return (
						<li
							key={post.id}
							ref={index === posts.length - 1 ? lastPostRef : undefined}
						>
							<Post
								post={post}
								likeCount={likes}
								unlikeCount={unlikes}
								commentCount={post.comments.length}
								groupInfo={post.group}
								ownReaction={ownReaction}
							/>
						</li>
					);
				})
			) : (
				<p className="text-xl text-gray-500">No posts yet</p>
			)}

			{isFetchingNextPage &&
				new Array(2).fill(0).map((_, index) => <ListPostSkeleton key={index} />)}
		</ul>
	);
};

export default PostFeed;
