import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.ts";
import APILinks from "@/constants/APILinks.ts";
import PostCreate from "@/models/form/PostCreate";
import handleError from "@/utils/handleError.ts";
import useUploadFile from "@/hooks/useUploadFile.tsx";
import useCreatePost from "@/hooks/post/useCreatePost.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import RichWYSIWYGEditor, { EditorHandle } from "@/components/ui/wysiwygEditor.tsx";

type CreatePostEditorType = {
	groupSlug: string;
};

const CreatePostEditor = (props: CreatePostEditorType) => {
	const { groupSlug } = props;
	const _titleRef = useRef<HTMLTextAreaElement>(null);
	const richTextEditorRef = useRef<EditorHandle>(null);
	const { user, authentication } = useAppContext();
	const [, setLoading] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { uploadFiles } = useUploadFile();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<PostCreate>({
		defaultValues: {
			title: "",
			content: null,
		},
	});
	const { ref: titleRef, ...rest } = register("title", { required: "Title is required" });

	const imageUploader = useCallback(
		async (image: File) => {
			try {
				setLoading(true);
				const [result] = await uploadFiles(
					{
						files: [image],
						endpoint: `${APILinks.imageUpload()}`,
					},
					{
						url: `${import.meta.env.VITE_API_BASE_URL}/uploadthing?userId=${user?.id}`,
					},
				);
				return {
					success: 1,
					file: {
						url: result.url,
					},
				};
			} catch (error: any) {
				handleError(error, setError);
			} finally {
				setLoading(false);
			}
		},
		[setError, uploadFiles, user?.id],
	);

	const onPostCreated = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: [groupSlug] });
		toast.dismiss();
		toast.success("Your post has been published.");
		navigate(`/group/${groupSlug}`);
	}, [groupSlug, navigate, queryClient]);

	const { mutate } = useCreatePost({ setError, onSuccess: onPostCreated });

	const onSubmit = useCallback(
		async (formData: PostCreate) => {
			const content = await richTextEditorRef.current?.save();
			formData.content = JSON.stringify(content);
			formData.groupSlug = groupSlug;
			mutate(formData);
		},
		[groupSlug, mutate],
	);

	useEffect(() => {
		setTimeout(() => {
			_titleRef?.current?.focus();
		}, 0);
	}, []);

	return (
		<div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
			<form id="subreddit-post-form" className="w-full" onSubmit={handleSubmit(onSubmit)}>
				<div className="prose prose-stone dark:prose-invert w-full">
					<Link to={`/group/${groupSlug}`}>Back</Link>
					<TextareaAutosize
						ref={(e) => {
							titleRef(e);
							// @ts-ignore
							_titleRef.current = e;
						}}
						{...rest}
						placeholder="Title"
						className={cn(
							"w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none",
							errors.title?.message ? "border border-red-500" : "",
						)}
					/>
					{errors.title?.message && (
						<span className="text-xs text-red-500 my-2">{errors.title.message}</span>
					)}
					<RichWYSIWYGEditor
						ref={richTextEditorRef}
						authentication={authentication}
						editorBlockId="post-editor"
						uploadImage={imageUploader}
					/>
					<p className="text-sm text-gray-500">
						Use{" "}
						<kbd className="rounded-md border bg-muted px-1 text-xs uppercase">Tab</kbd>{" "}
						to open the command menu.
					</p>
				</div>
			</form>
		</div>
	);
};

export default CreatePostEditor;
