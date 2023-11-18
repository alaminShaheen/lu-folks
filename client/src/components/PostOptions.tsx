import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import QueryKeys from "@/constants/QueryKeys.ts";
import UpdatePost from "@/models/form/UpdatePost.ts";
import handleError from "@/utils/handleError.ts";
import AppConstants from "@/constants/AppConstants.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import useDeletePost from "@/hooks/post/useDeletePost.tsx";
import useUpdatePost from "@/hooks/post/useUpdatePost.tsx";
import PostUpdateModal from "@/components/PostUpdateModal.tsx";
import PaginatedResponse from "@/models/PaginatedResponse.ts";
import ConfirmationModal from "@/components/ConfirmationModal.tsx";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog.tsx";
import { useNavigate } from "react-router-dom";

type PostOptionsProps = {
	post: ExtendedPost;
};

const PostOptions = (props: PostOptionsProps) => {
	const { post } = props;
	const queryClient = useQueryClient();
	const [postUpdateModalOpen, setPostUpdateModalOpen] = useState(false);
	const navigate = useNavigate();

	const closeModal = useCallback(() => {
		setPostUpdateModalOpen(false);
	}, []);

	const onPostDeletionSuccess = useCallback(
		async (deletedPost: ExtendedPost) => {
			// update group feed
			queryClient.setQueryData<
				InfiniteData<PaginatedResponse<ExtendedPost>, undefined | string>
			>([QueryKeys.FETCH_INFINITE_POST, deletedPost.group.id], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						pages: [...oldData.pages.flatMap((pages) => pages.data)]
							.filter((post) => post.id !== deletedPost.id)
							.sort((a, b) => {
								return (
									new Date(b.createdAt).getTime() -
									new Date(a.createdAt).getTime()
								);
							})
							.reduce<PaginatedResponse<ExtendedPost>[]>(
								(paginatedPosts, currentPost, currentIndex) => {
									const chunkIndex = Math.floor(
										currentIndex /
											AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
									);
									if (!paginatedPosts[chunkIndex]) {
										paginatedPosts.push({ data: [], nextId: undefined });
									}
									paginatedPosts[paginatedPosts.length - 1].data.push(
										currentPost,
									);
									if (
										paginatedPosts[paginatedPosts.length - 1].data.length ===
										AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH
									) {
										paginatedPosts[paginatedPosts.length - 1].nextId =
											currentPost.id;
									}
									return paginatedPosts;
								},
								[],
							),
					};
				}
				return oldData;
			});

			// update home feed
			queryClient.setQueryData<
				InfiniteData<PaginatedResponse<ExtendedPost>, undefined | string>
			>([QueryKeys.FETCH_INFINITE_POST, null], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						pages: [...oldData.pages.flatMap((pages) => pages.data)]
							.filter((post) => post.id !== deletedPost.id)
							.sort((a, b) => {
								return (
									new Date(b.createdAt).getTime() -
									new Date(a.createdAt).getTime()
								);
							})
							.reduce<PaginatedResponse<ExtendedPost>[]>(
								(paginatedPosts, currentPost, currentIndex) => {
									const chunkIndex = Math.floor(
										currentIndex /
											AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
									);
									if (!paginatedPosts[chunkIndex]) {
										paginatedPosts.push({ data: [], nextId: undefined });
									}
									paginatedPosts[paginatedPosts.length - 1].data.push(
										currentPost,
									);
									if (
										paginatedPosts[paginatedPosts.length - 1].data.length ===
										AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH
									) {
										paginatedPosts[paginatedPosts.length - 1].nextId =
											currentPost.id;
									}
									return paginatedPosts;
								},
								[],
							),
					};
				}
				return oldData;
			});

			toast.dismiss();
			toast.success("You post has been deleted successfully");
			console.log(deletedPost);
			navigate(`/group/${deletedPost.group.id}`);
		},
		[queryClient],
	);

	const onPostUpdateSuccess = useCallback(
		(updatedPost: ExtendedPost) => {
			// update group feed
			queryClient.setQueryData<
				InfiniteData<PaginatedResponse<ExtendedPost>, undefined | string>
			>([QueryKeys.FETCH_INFINITE_POST, updatedPost.group.id], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						pages: [...oldData.pages.flatMap((pages) => pages.data)]
							.map((post) => {
								if (post.id === updatedPost.id) {
									return {
										...post,
										content: updatedPost.content,
										title: updatedPost.title,
									};
								}
								return post;
							})
							.sort((a, b) => {
								return (
									new Date(b.createdAt).getTime() -
									new Date(a.createdAt).getTime()
								);
							})
							.reduce<PaginatedResponse<ExtendedPost>[]>(
								(paginatedPosts, currentPost, currentIndex) => {
									const chunkIndex = Math.floor(
										currentIndex /
											AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
									);
									if (!paginatedPosts[chunkIndex]) {
										paginatedPosts.push({ data: [], nextId: undefined });
									}
									paginatedPosts[paginatedPosts.length - 1].data.push(
										currentPost,
									);
									if (
										paginatedPosts[paginatedPosts.length - 1].data.length ===
										AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH
									) {
										paginatedPosts[paginatedPosts.length - 1].nextId =
											currentPost.id;
									}
									return paginatedPosts;
								},
								[],
							),
					};
				}
				return oldData;
			});

			// update home feed
			queryClient.setQueryData<
				InfiniteData<PaginatedResponse<ExtendedPost>, undefined | string>
			>([QueryKeys.FETCH_INFINITE_POST, null], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						pages: [...oldData.pages.flatMap((pages) => pages.data)]
							.map((post) => {
								if (post.id === updatedPost.id) {
									return {
										...post,
										content: updatedPost.content,
										title: updatedPost.title,
									};
								}
								return post;
							})
							.sort((a, b) => {
								return (
									new Date(b.createdAt).getTime() -
									new Date(a.createdAt).getTime()
								);
							})
							.reduce<PaginatedResponse<ExtendedPost>[]>(
								(paginatedPosts, currentPost, currentIndex) => {
									const chunkIndex = Math.floor(
										currentIndex /
											AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
									);
									if (!paginatedPosts[chunkIndex]) {
										paginatedPosts.push({ data: [], nextId: undefined });
									}
									paginatedPosts[paginatedPosts.length - 1].data.push(
										currentPost,
									);
									if (
										paginatedPosts[paginatedPosts.length - 1].data.length ===
										AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH
									) {
										paginatedPosts[paginatedPosts.length - 1].nextId =
											currentPost.id;
									}
									return paginatedPosts;
								},
								[],
							),
					};
				}
				return oldData;
			});

			queryClient.setQueryData<ExtendedPost>(
				[QueryKeys.GET_POST, updatedPost.id],
				(oldData) => {
					if (oldData) {
						return {
							...oldData,
							title: updatedPost.title,
							content: updatedPost.content,
						};
					}
					return oldData;
				},
			);

			closeModal();
			toast.dismiss();
			toast.success("Your post has been updated.");
		},
		[queryClient, closeModal],
	);

	const {
		mutate: deletePost,
		isPending: isDeletingPost,
		isError: isErrorDeletingPost,
		error: deletingPostError,
	} = useDeletePost({
		postId: post.id,
		onSuccess: onPostDeletionSuccess,
	});

	const {
		mutate: updatePost,
		isPending: isUpdatingPost,
		isError: isErrorUpdatingPost,
		error: updatingPostError,
	} = useUpdatePost({
		postId: post.id,
		onSuccess: onPostUpdateSuccess,
	});

	const deleteClicked = useCallback(() => {
		deletePost();
	}, [deletePost]);

	const updateClicked = useCallback(
		(data: UpdatePost) => {
			updatePost(data);
		},
		[updatePost],
	);

	if (isErrorUpdatingPost) {
		handleError(updatingPostError);
	} else if (isErrorDeletingPost) {
		handleError(deletingPostError);
	}

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger className="ml-2">
					<MoreHorizontal className="h-4 w-4 text-xs text-zinc-500" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-white" align="end">
					<DropdownMenuItem asChild>
						<span className="gap-2 w-full" onClick={() => setPostUpdateModalOpen(true)}>
							<PenSquare className="h-4 w-4 text-xs text-zinc-500" />
							Update
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<AlertDialogTrigger
							className="gap-2 w-full"
							disabled={isUpdatingPost || isDeletingPost}
						>
							<Trash2 className="h-4 w-4 text-xs text-red-500" />
							Delete
						</AlertDialogTrigger>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmationModal
				onAction={deleteClicked}
				title="Are you sure you want to delete this post?"
				description="This action cannot be undone and will permanently delete your post and all its comments."
				actionButtonVariant="destructive"
				actonButtonText="Delete"
			/>

			<PostUpdateModal
				onAction={updateClicked}
				post={post}
				open={postUpdateModalOpen}
				toggle={closeModal}
				modalTitle="Edit Post"
				modalDescription="Make changes to your post here. Click save when you're done."
			/>
		</AlertDialog>
	);
};

export default PostOptions;
