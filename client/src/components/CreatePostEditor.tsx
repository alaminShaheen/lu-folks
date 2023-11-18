import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Fragment, useCallback, useRef } from "react";
import QueryKeys from "@/constants/QueryKeys.ts";
import { Button } from "@/components/ui/button.tsx";
import ExtendedPost from "@/models/ExtendedPost.ts";
import AppConstants from "@/constants/AppConstants.ts";
import useCreatePost from "@/hooks/post/useCreatePost.tsx";
import { EditorHandle } from "@/components/ui/wysiwygEditor.tsx";
import PaginatedResponse from "@/models/PaginatedResponse.ts";
import PostEditorForm, { PostForm } from "@/components/PostEditorForm.tsx";

type CreatePostEditorType = {
	groupSlug: string;
};

const CREATE_POST_FORM_ID = "update-post-form";

const CreatePostEditor = (props: CreatePostEditorType) => {
	const { groupSlug } = props;
	const richTextEditorRef = useRef<EditorHandle>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const onPostCreated = useCallback(
		async (data: ExtendedPost) => {
			queryClient.setQueryData<
				InfiniteData<PaginatedResponse<ExtendedPost>, undefined | string>
			>([QueryKeys.FETCH_INFINITE_POST, data.group.id], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						pages: [...oldData.pages.flatMap((pages) => pages.data), data]
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

			queryClient.setQueryData<
				InfiniteData<PaginatedResponse<ExtendedPost>, undefined | string>
			>([QueryKeys.FETCH_INFINITE_POST, null], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						pages: [...oldData.pages.flatMap((pages) => pages.data), data]
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
									paginatedPosts[paginatedPosts.length - 1].data.push(currentPos);
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
			toast.success("Your post has been published.");
			navigate(`/group/${groupSlug}`);
		},
		[groupSlug, navigate, queryClient],
	);

	const { mutate, isPending } = useCreatePost({ onSuccess: onPostCreated });

	const onSubmit = useCallback(
		async (formData: PostForm) => {
			const content = await richTextEditorRef.current?.save();
			formData.content = JSON.stringify(content);
			mutate({ ...formData, groupSlug });
		},
		[groupSlug, mutate],
	);

	return (
		<Fragment>
			<PostEditorForm
				formId={CREATE_POST_FORM_ID}
				onSubmit={onSubmit}
				ref={richTextEditorRef}
				submissionElement={
					<div className="w-full flex justify-end">
						<Button
							loading={isPending}
							type="submit"
							className="w-full"
							form={CREATE_POST_FORM_ID}
						>
							Post
						</Button>
					</div>
				}
			/>
		</Fragment>
	);
};

export default CreatePostEditor;
