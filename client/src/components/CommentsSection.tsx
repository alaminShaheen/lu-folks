import { toast } from "react-toastify";
import PostComment from "@/components/PostComment.tsx";
import ReactionType from "@/models/enums/ReactionType.ts";
import CreateComment from "@/components/CreateComment.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import useGetPostComments from "@/hooks/comment/useGetPostComments.tsx";

type CommentsSectionProps = {
	postId: string;
};

const CommentsSection = (props: CommentsSectionProps) => {
	const { postId } = props;
	const { user } = useAppContext();

	const {
		data: comments,
		isLoading: isFetchingComments,
		isError: isFetchCommentError,
		error: fetchCommentError,
	} = useGetPostComments({ postId: postId });

	if (isFetchCommentError) {
		toast.error(fetchCommentError.message);
	}

	if (isFetchingComments) {
		return <div className="rounded-md bg-white shadow rounded">Loading....</div>;
	} else if (comments) {
		return (
			<div className="flex flex-col gap-y-4 w-full bg-white">
				<hr className="w-full h-px my-4" />

				<CreateComment postId={postId} />
				{isFetchingComments || !comments ? (
					<div>Loading...</div>
				) : (
					<div className="flex flex-col gap-y-6 mt-4">
						{comments
							.filter((comment) => !comment.replyToCommentId)
							.map((topLevelComment) => {
								const likes = topLevelComment.commentReactions?.filter(
									(reaction) => reaction.type === ReactionType.LIKE,
								).length;
								const unlikes = topLevelComment.commentReactions?.filter(
									(reaction) => reaction.type === ReactionType.UNLIKE,
								).length;
								const ownReaction = topLevelComment.commentReactions?.find(
									(reaction) => reaction.userId === user?.id,
								)?.type;

								return (
									<div key={topLevelComment.id} className="flex flex-col">
										<div className="mb-2">
											<PostComment
												postId={postId}
												likeCount={likes}
												unlikeCount={unlikes}
												ownReaction={ownReaction}
												comment={topLevelComment}
											/>
										</div>
									</div>
								);
							})}
					</div>
				)}
			</div>
		);
	} else {
		return "Comment does not exist";
	}
};

export default CommentsSection;
