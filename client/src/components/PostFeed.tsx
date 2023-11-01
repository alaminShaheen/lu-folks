import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import Post from "@/components/Post.tsx";
import GroupInfo from "@/models/GroupInfo.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import ReactionType from "@/models/enums/ReactionType.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import useFetchPaginatedPosts from "@/hooks/post/useFetchPaginatedPosts.tsx";

type PostFeedProps = {
	initialPosts: ExtendedPost[];
	groupInfo: GroupInfo;
};
const PostFeed = (props: PostFeedProps) => {
	const { initialPosts, groupInfo } = props;
	const { user } = useAppContext();
	const lastPostContainerRef = useRef<HTMLLIElement>(null);
	const { ref: lastPostRef, entry } = useIntersection({
		root: lastPostContainerRef.current,
		threshold: 1,
	});
	console.log(groupInfo.id);
	const {
		data: postData,
		fetchNextPage,
		isFetchingNextPage,
	} = useFetchPaginatedPosts({ initialPosts, groupSlug: groupInfo.id });

	useEffect(() => {
		if (entry?.isIntersecting) {
			void fetchNextPage(); // Load more posts when the last post comes into view
		}
	}, [entry, fetchNextPage]);

	const posts = postData?.pages.flatMap((page) => page) || initialPosts;

	return (
		<ul className="flex flex-col col-span-2 space-y-6 list-none">
			{posts.map((post, index) => {
				const likes = post.postReactions.filter(
					(reaction) => reaction.type === ReactionType.LIK,
				).length;
				const unlikes = post.postReactions.filter(
					(reaction) => reaction.type === ReactionType.UNLIK,
				).length;
				const ownReaction = post.postReactions.find(
					(reaction) => reaction.userId === user?.i,
				)?.type;
				return (
					<li key={post.id} ref={index === posts.length - 1 ? lastPostRef : undefined}>
						<Post
							post={post}
							likeCount={likes}
							unlikeCount={unlikes}
							commentCount={post.comments.length}
							groupInfo={groupInfo}
							ownReaction={ownReaction}
						/>
					</li>
				);
			})}

			{isFetchingNextPage && (
				<li className="flex justify-center">
					{/*<Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />*/}
					Loading
				</li>
			)}
		</ul>
	);
};

export default PostFeed;
