import { clsx } from "clsx";
import ReactionType from "@/models/enums/ReactionType.ts";
import { Fragment, useCallback, useEffect, useState } from "react";
import { usePrevious } from "@mantine/hooks";
import handleError from "@/utils/handleError.ts";
import useCommentReaction from "@/hooks/comment/useCommentReaction.tsx";
import CreateCommentReaction from "@/models/CreateCommentReaction.ts";
import { Button } from "@/components/ui/button.tsx";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type CommentReactionsProps = {
	commentId: string;
	likeCount: number;
	unlikeCount: number;
	ownReaction?: ReactionType;
	groupId: string;
};

const CommentReactions = (props: CommentReactionsProps) => {
	const { likeCount, unlikeCount, ownReaction, commentId } = props;
	const [commentLikeCount, setCommentLikeCount] = useState(likeCount);
	const [commentUnlikeCount, setCommentUnlikeCount] = useState(unlikeCount);
	const [ownCommentReaction, setOwnCommentReaction] = useState<ReactionType | undefined>(
		ownReaction,
	);
	const previousUserCommentReaction = usePrevious(ownCommentReaction);

	const onReactionError = useCallback(
		(error: any, reactionInfo: CreateCommentReaction) => {
			if (reactionInfo.reaction === ReactionType.LIKE) {
				setCommentLikeCount((prev) => prev - 1);
			} else {
				setCommentLikeCount((prev) => prev + 1);
			}
			setOwnCommentReaction(previousUserCommentReaction);

			handleError(error);
		},
		[previousUserCommentReaction],
	);

	const onMutate = useCallback(
		(reactionInfo: CreateCommentReaction) => {
			if (reactionInfo.reaction === ownCommentReaction) {
				setOwnCommentReaction(undefined);
				if (reactionInfo.reaction === ReactionType.LIKE) {
					setCommentLikeCount((prev) => prev - 1);
				} else {
					setCommentUnlikeCount((prev) => prev - 1);
				}
			} else {
				if (reactionInfo.reaction === ReactionType.LIKE) {
					setCommentLikeCount((prev) => prev + 1);
					setCommentUnlikeCount((prev) => (ownCommentReaction ? prev - 1 : prev));
				} else {
					setCommentUnlikeCount((prev) => prev + 1);
					setCommentLikeCount((prev) => (ownCommentReaction ? prev - 1 : prev));
				}
				setOwnCommentReaction(reactionInfo.reaction);
			}
		},
		[ownCommentReaction],
	);

	const { mutate: reactToComment } = useCommentReaction({
		onError: onReactionError,
		onMutate,
		onSuccess: async () => {},
	});

	const likeComment = useCallback(() => {
		reactToComment({ reaction: ReactionType.LIKE, commentSlug: commentId });
	}, [commentId, reactToComment]);

	const unlikeComment = useCallback(() => {
		reactToComment({ reaction: ReactionType.UNLIKE, commentSlug: commentId });
	}, [commentId, reactToComment]);

	useEffect(() => {
		setOwnCommentReaction(ownReaction);
		setCommentLikeCount(likeCount);
		setCommentUnlikeCount(unlikeCount);
	}, [likeCount, unlikeCount, ownReaction]);

	return (
		<Fragment>
			<Button
				variant="ghost"
				className="p-0 gap-2 hover:bg-transparent cursor-auto"
				onClick={likeComment}
			>
				<ThumbsUp
					className={clsx(
						"h-4 w-4 hover:text-blue-700 cursor-pointer hover:scale-125 transform transition duration-100",
						ownCommentReaction === ReactionType.LIKE
							? "text-blue-700"
							: "text-gray-500",
					)}
				/>{" "}
				{commentLikeCount} {/*{likeCount === 1 ? "like" : "likes"}*/}
			</Button>
			<Button
				variant="ghost"
				className="p-0 gap-2 hover:bg-transparent cursor-auto"
				onClick={unlikeComment}
			>
				<ThumbsDown
					className={clsx(
						"h-4 w-4 hover:text-red-500 cursor-pointer hover:scale-125 transform transition duration-100",
						ownCommentReaction === ReactionType.UNLIKE
							? "text-red-500"
							: "text-gray-500",
					)}
				/>{" "}
				{commentUnlikeCount} {/*{unlikeCount === 1 ? "unlike" : "unlikes"}*/}
			</Button>
		</Fragment>
	);
};

export default CommentReactions;
