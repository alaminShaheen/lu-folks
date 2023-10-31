import React, { useCallback, useRef, useState } from "react";
import ExtendedPost from "@/models/ExtendedPost.ts";
import { useIntersection } from "@mantine/hooks";
import handleError from "@/utils/handleError.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import APILinks from "@/constants/APILinks.ts";

type PostFeed = {
	initialPosts: ExtendedPost[];
	groupName: string;
};
const PostFeed = () => {
	const lastPostContainerRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const { ref: lastPostRef, entry } = useIntersection({
		root: lastPostContainerRef,
		threshold: 1,
	});

	const fetchPosts = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = axiosInstance.get<ExtendedPost[]>(APILinks.getPosts());
		} catch (error: any) {
			handleError(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<ul className="flex flex-col col-span-2 space-y-6 list-none">
			{posts.map((post, index) => {
				const votesAmt = post.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

				if (index === posts.length - 1) {
					// Add a ref to the last post in the list
					return (
						<li key={post.id} ref={ref}>
							<Post
								post={post}
								commentAmt={post.comments.length}
								subredditName={post.subreddit.name}
								votesAmt={votesAmt}
								currentVote={currentVote}
							/>
						</li>
					);
				} else {
					return (
						<Post
							key={post.id}
							post={post}
							commentAmt={post.comments.length}
							subredditName={post.subreddit.name}
							votesAmt={votesAmt}
							currentVote={currentVote}
						/>
					);
				}
			})}

			{isFetchingNextPage && (
				<li className="flex justify-center">
					<Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
				</li>
			)}
		</ul>
	);
};

export default PostFeed;
