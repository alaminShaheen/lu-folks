import { clsx } from "clsx";
import { Reply } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useCallback, useRef, useState } from "react";
import Comment from "@/models/Comment.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import handleError from "@/utils/handleError.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import { Textarea } from "@/components/ui/textarea.tsx";
import ReactionType from "@/models/enums/ReactionType.ts";
import CommentReactions from "@/components/CommentReactions.tsx";
import useCreateComment from "@/hooks/comment/useCreateComment.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";
import useGetCommentReplies from "@/hooks/comment/useGetCommentReplies.tsx";

type PostCommentProps = {
	postId: string;
	comment: Comment;
	likeCount: number;
	unlikeCount: number;
	ownReaction?: ReactionType;
	groupId: string;
};

const PostComment = (props: PostCommentProps) => {
	const { comment, unlikeCount, ownReaction, likeCount, postId, groupId } = props;
	const [isReplying, setIsReplying] = useState(false);
	const commentRef = useRef<HTMLDivElement>(null);
	const { user } = useAppContext();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<{ comment: string }>({
		defaultValues: {
			comment: "",
		},
	});
	const queryClient = useQueryClient();

	const onCommentCreated = useCallback(
		async (newComment: Comment) => {
			queryClient.setQueryData<Comment[]>(
				[QueryKeys.GET_COMMENT_REPLIES, comment.id],
				(oldData) => {
					if (oldData) {
						return [...oldData, newComment];
					}
					return oldData;
				},
			);

			queryClient.setQueryData<ExtendedPost>([QueryKeys.GET_POST, postId], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						comments: [...oldData.comments, newComment],
					};
				}
				return oldData;
			});
			reset({ comment: "" });
			setIsReplying(false);
		},
		[queryClient, postId, reset],
	);

	const { mutate: createComment } = useCreateComment({
		onSuccess: onCommentCreated,
	});

	const {
		data: replies,
		isLoading: isFetchingReplies,
		isError: isFetchingReplyError,
		error: fetchingReplyError,
	} = useGetCommentReplies({ parentCommentId: comment.id });

	const onReplyClicked = useCallback(
		(data: { comment: string }) => {
			createComment({
				comment: data.comment,
				postId,
				replyToCommentId: comment.id,
			});
		},
		[comment, createComment],
	);

	if (isFetchingReplyError) {
		handleError(fetchingReplyError);
	}

	return (
		<div ref={commentRef} className="flex flex-col">
			<div className="flex items-center">
				<UserAvatar
					username={comment.commenter.username || ""}
					imageUrl={comment.commenter.imageUrl || ""}
					className="h-6 w-6"
				/>
				<div className="ml-2 flex items-center gap-x-2">
					<p className="text-sm font-medium text-gray-900">
						{comment.commenter.username}
					</p>

					<p className="max-h-40 truncate text-xs text-zinc-500">
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div>

			<p className="text-sm text-zinc-900 mt-2">{comment.comment}</p>

			<div className="flex gap-2 items-center">
				<CommentReactions
					groupId={groupId}
					commentId={comment.id}
					likeCount={likeCount}
					unlikeCount={unlikeCount}
					ownReaction={ownReaction}
				/>

				<Button
					variant="ghost"
					className="p-0 gap-2 hover:bg-transparent cursor-pointer"
					onClick={() => {
						setIsReplying(true);
					}}
				>
					<Reply
						className={clsx(
							"h-4 w-4 hover:text-teal-500 hover:scale-125 transform transition duration-100",
						)}
					/>{" "}
					{isFetchingReplies ? <div>Loading...</div> : replies ? replies.length : 0}
				</Button>
			</div>

			{isReplying ? (
				<div className="grid w-full gap-1.5">
					<Label htmlFor="comment">Your Reply</Label>
					<form className="mt-2" onSubmit={handleSubmit(onReplyClicked)}>
						<Textarea
							{...register("comment", { required: "Comment is required." })}
							onFocus={(e) =>
								e.currentTarget.setSelectionRange(
									e.currentTarget.value.length,
									e.currentTarget.value.length,
								)
							}
							autoFocus
							id="comment"
							rows={1}
							placeholder="What are your thoughts?"
						/>

						{errors.comment?.message && (
							<span className="text-xs text-red-500 my-2">
								{errors.comment.message}
							</span>
						)}

						<div className="mt-2 flex justify-end gap-2">
							<Button
								tabIndex={-1}
								variant="ghost"
								onClick={() => setIsReplying(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Post</Button>
						</div>
					</form>
				</div>
			) : null}

			{/*Render replies */}
			{isFetchingReplies ? (
				<div>Loading...</div>
			) : replies ? (
				<Fragment>
					{replies.map((reply) => {
						const likes = comment.commentReactions?.filter(
							(reaction) => reaction.type === ReactionType.LIKE,
						).length;
						const unlikes = comment.commentReactions?.filter(
							(reaction) => reaction.type === ReactionType.UNLIKE,
						).length;
						const ownReaction = comment.commentReactions?.find(
							(reaction) => reaction.userId === user?.id,
						)?.type;

						return (
							<div
								key={reply.id}
								className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
							>
								<PostComment
									groupId={groupId}
									comment={reply}
									postId={postId}
									likeCount={likes}
									unlikeCount={unlikes}
									ownReaction={ownReaction}
								/>
							</div>
						);
					})}
				</Fragment>
			) : null}
		</div>
	);
};

export default PostComment;
