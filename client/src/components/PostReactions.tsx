import { Fragment, useCallback, useEffect, useState } from "react";
import { usePrevious } from "@mantine/hooks";
import { Button } from "@/components/ui/button.tsx";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import ReactionType from "@/models/enums/ReactionType.ts";
import usePostReact from "@/hooks/post/usePostReaction.tsx";
import CreatePostReaction from "@/models/CreatePostReaction.ts";
import handleError from "@/utils/handleError.ts";
import { clsx } from "clsx";
import QueryKeys from "@/constants/QueryKeys.ts";
import { useQueryClient } from "@tanstack/react-query";

type PostReactionsProps = {
	postId: string;
	likeCount: number;
	unlikeCount: number;
	groupId: string;
	ownReaction?: ReactionType;
};

const PostReactions = (props: PostReactionsProps) => {
	const { likeCount, unlikeCount, ownReaction, postId, groupId } = props;
	const [postLikeCount, setPostLikeCount] = useState(likeCount);
	const [postUnlikeCount, setPostUnlikeCount] = useState(unlikeCount);
	const [ownPostReaction, setOwnPostReaction] = useState<ReactionType | undefined>(ownReaction);
	const previousUserPostReaction = usePrevious(ownPostReaction);
	const queryClient = useQueryClient();

	const onReactionError = useCallback(
		(error: any, reactionInfo: CreatePostReaction) => {
			if (reactionInfo.reaction === ReactionType.LIKE) {
				setPostLikeCount((prev) => prev - 1);
			} else {
				setPostLikeCount((prev) => prev + 1);
			}
			setOwnPostReaction(previousUserPostReaction);

			handleError(error);
		},
		[previousUserPostReaction],
	);

	const onMutate = useCallback(
		(reactionInfo: CreatePostReaction) => {
			if (reactionInfo.reaction === ownPostReaction) {
				setOwnPostReaction(undefined);
				if (reactionInfo.reaction === ReactionType.LIKE) {
					setPostLikeCount((prev) => prev - 1);
				} else {
					setPostUnlikeCount((prev) => prev - 1);
				}
			} else {
				if (reactionInfo.reaction === ReactionType.LIKE) {
					setPostLikeCount((prev) => prev + 1);
					setPostUnlikeCount((prev) => (ownPostReaction ? prev - 1 : prev));
				} else {
					setPostUnlikeCount((prev) => prev + 1);
					setPostLikeCount((prev) => (ownPostReaction ? prev - 1 : prev));
				}
				setOwnPostReaction(reactionInfo.reaction);
			}
		},
		[ownPostReaction],
	);

	const { mutate: reactToPost } = usePostReact({
		onError: onReactionError,
		onMutate,
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [QueryKeys.INITIAL_FEED_POSTS] });
			await queryClient.refetchQueries({ queryKey: [QueryKeys.FETCH_INFINITE_POST] });
		},
	});

	const likePost = useCallback(() => {
		reactToPost({ reaction: ReactionType.LIKE, postSlug: postId });
	}, [postId, reactToPost]);

	const unlikePost = useCallback(() => {
		reactToPost({ reaction: ReactionType.UNLIKE, postSlug: postId });
	}, [postId, reactToPost]);

	useEffect(() => {
		setOwnPostReaction(ownReaction);
		setPostLikeCount(likeCount);
		setPostUnlikeCount(unlikeCount);
	}, [likeCount, unlikeCount, ownReaction]);

	return (
		<Fragment>
			<Button
				variant="ghost"
				className="p-0 gap-2 hover:bg-transparent cursor-auto"
				onClick={likePost}
			>
				<ThumbsUp
					className={clsx(
						"h-4 w-4 hover:text-blue-700 cursor-pointer hover:scale-125 transform transition duration-100",
						ownPostReaction === ReactionType.LIKE ? "text-blue-700" : "text-gray-500",
					)}
				/>{" "}
				{postLikeCount} {/*{likeCount === 1 ? "like" : "likes"}*/}
			</Button>
			<Button
				variant="ghost"
				className="p-0 gap-2 hover:bg-transparent cursor-auto"
				onClick={unlikePost}
			>
				<ThumbsDown
					className={clsx(
						"h-4 w-4 hover:text-red-500 cursor-pointer hover:scale-125 transform transition duration-100",
						ownPostReaction === ReactionType.UNLIKE ? "text-red-500" : "text-gray-500",
					)}
				/>{" "}
				{postUnlikeCount} {/*{unlikeCount === 1 ? "unlike" : "unlikes"}*/}
			</Button>
		</Fragment>
	);
};

export default PostReactions;
