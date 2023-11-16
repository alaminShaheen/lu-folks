import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useCallback, useState } from "react";
import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import useDeleteComment from "@/hooks/comment/useDeleteComment.tsx";
import ConfirmationModal from "@/components/ConfirmationModal.tsx";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog.tsx";
import Comment from "@/models/Comment.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import { toast } from "react-toastify";
import CommentUpdateModal from "@/components/CommentUpdateModal.tsx";
import useUpdateComment from "@/hooks/comment/useUpdateComment.tsx";
import UpdateComment from "@/models/form/UpdateComment.ts";

type CommentOptions = {
	commentId: string;
	parentCommentId?: string;
	currentCommentText: string;
};

const CommentOptions = (props: CommentOptions) => {
	const { commentId, parentCommentId, currentCommentText } = props;
	const queryClient = useQueryClient();
	const [commentUpdateModalOpen, setCommentUpdateModalOpen] = useState(false);

	const closeModal = useCallback(() => {
		setCommentUpdateModalOpen(false);
	}, []);

	const onCommentDeletionSuccess = useCallback(
		(deletedComment: Comment) => {
			// if deleted comment is a reply
			if (parentCommentId) {
				// update replies of parent comment
				queryClient.setQueryData<Comment[]>(
					[QueryKeys.GET_COMMENT_REPLIES, parentCommentId],
					(oldData) => {
						if (oldData) {
							return oldData.filter((comment) => comment.id !== deletedComment.id);
						}
						return oldData;
					},
				);
			} else {
				// if deleted comment is a top level comment of a post
				queryClient.setQueryData<Comment[]>(
					[QueryKeys.GET_POST_COMMENTS, deletedComment.postId],
					(oldData) => {
						if (oldData) {
							return oldData.filter((comment) => comment.id !== deletedComment.id);
						}
						return oldData;
					},
				);
			}

			// update comment count of post detail
			queryClient.setQueryData<ExtendedPost>(
				[QueryKeys.GET_POST, deletedComment.postId],
				(oldData) => {
					if (oldData) {
						return {
							...oldData,
							comments: oldData.comments.filter(
								(comment) => comment.id !== deletedComment.id,
							),
						};
					}
					return oldData;
				},
			);

			toast.success("The comment has been deleted.");
		},
		[queryClient, parentCommentId],
	);

	const onCommentUpdateSuccess = useCallback(
		(updatedComment: Comment) => {
			// if deleted comment is a reply
			if (updatedComment.replyToCommentId) {
				// update replies of parent comment
				queryClient.setQueryData<Comment[]>(
					[QueryKeys.GET_COMMENT_REPLIES, parentCommentId],
					(oldData) => {
						if (oldData) {
							return oldData.map((comment) => {
								if (comment.id === updatedComment.id) {
									return {
										...comment,
										comment: updatedComment.comment,
									};
								}
								return comment;
							});
						}
						return oldData;
					},
				);
			} else {
				// if deleted comment is a top level comment of a post
				queryClient.setQueryData<Comment[]>(
					[QueryKeys.GET_POST_COMMENTS, updatedComment.postId],
					(oldData) => {
						if (oldData) {
							return oldData.map((comment) => {
								if (comment.id === updatedComment.id) {
									return {
										...comment,
										comment: updatedComment.comment,
									};
								}
								return comment;
							});
						}
						return oldData;
					},
				);
			}

			closeModal();
		},
		[queryClient, parentCommentId],
	);

	const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment({
		commentId,
		onSuccess: onCommentDeletionSuccess,
	});

	const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment({
		commentId,
		onSuccess: onCommentUpdateSuccess,
	});

	const deleteClicked = useCallback(() => {
		deleteComment();
	}, [deleteComment]);

	const updateClicked = useCallback(
		(data: UpdateComment) => {
			updateComment(data);
		},
		[updateComment],
	);

	return (
		<Fragment>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<MoreHorizontal className="h-4 w-4 text-xs text-zinc-500" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-white" align="end">
					<DropdownMenuItem asChild>
						<span
							className="gap-2 w-full"
							onClick={() => setCommentUpdateModalOpen(true)}
						>
							<PenSquare className="h-4 w-4 text-xs text-zinc-500" />
							Update
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<AlertDialogTrigger
							className="gap-2 w-full"
							disabled={isUpdatingComment || isDeletingComment}
						>
							<Trash2 className="h-4 w-4 text-xs text-red-500" />
							Delete
						</AlertDialogTrigger>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmationModal
				onAction={deleteClicked}
				title="Are you sure you want to delete this comment?"
				description="This action cannot be undone and will permanently delete your comment."
				actionButtonVariant="destructive"
				actonButtonText="Delete"
			/>

			<CommentUpdateModal
				toggle={closeModal}
				open={commentUpdateModalOpen}
				commentId={commentId}
				onAction={updateClicked}
				title="Edit comment"
				description="Make changes to your comment here. Click save when you're done."
				currentComment={currentCommentText}
			/>
		</Fragment>
	);
};

export default CommentOptions;
