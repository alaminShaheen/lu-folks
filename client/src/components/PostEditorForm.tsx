import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { forwardRef, Fragment, ReactNode, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils.ts";
import APILinks from "@/constants/APILinks.ts";
import handleError from "@/utils/handleError.ts";
import useUploadFile from "@/hooks/useUploadFile.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import RichWYSIWYGEditor, { EditorHandle } from "@/components/ui/wysiwygEditor.tsx";

export type PostForm = {
	title: string;
	content: any;
};

type PostEditorProps = {
	formId: string;
	defaultTitle?: string;
	defaultContent?: string;
	onSubmit: (data: PostForm) => void;
	editorClassName?: string;
	submissionElement: ReactNode;
};

const PostEditorForm = forwardRef<EditorHandle, PostEditorProps>((props, richTextEditorRef) => {
	const { formId, submissionElement, defaultContent, defaultTitle, onSubmit, editorClassName } =
		props;
	const _titleRef = useRef<HTMLTextAreaElement>(null);
	const { authentication, user } = useAppContext();
	const { uploadFiles } = useUploadFile();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<PostForm>({
		defaultValues: {
			title: defaultTitle ?? "",
			content: defaultContent ?? null,
		},
	});
	const { ref: titleRef, ...rest } = register("title", { required: "Title is required" });

	const imageUploader = useCallback(
		async (image: File) => {
			try {
				const [result] = await uploadFiles(
					{
						files: [image],
						endpoint: `${APILinks.imageUpload()}`,
					},
					{
						url: `${import.meta.env.VITE_API_BASE_URL}/uploadthing?userId=${user?.id!}`,
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
			}
		},
		[setError, uploadFiles, user?.id],
	);

	useEffect(() => {
		setTimeout(() => {
			_titleRef?.current?.focus();
		}, 0);
	}, []);

	return (
		<Fragment>
			<div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200 dark:border-zinc-400 dark:bg-slate-700">
				<form id={formId} className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<div className="prose prose-stone dark:prose-invert w-full">
						<TextareaAutosize
							{...rest}
							ref={(e) => {
								titleRef(e);
								// @ts-ignore
								_titleRef.current = e;
							}}
							placeholder="Title"
							className={cn(
								"w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none",
								errors.title?.message ? "border border-red-500" : "",
							)}
						/>
						{errors.title?.message && (
							<span className="text-xs text-red-500 my-2">
								{errors.title.message}
							</span>
						)}
						<RichWYSIWYGEditor
							ref={richTextEditorRef}
							authentication={authentication}
							editorBlockId={`post-editor`}
							uploadImage={imageUploader}
							defaultData={defaultContent}
							editorClassName={editorClassName}
						/>
						<p className="text-sm text-gray-500">
							Use{" "}
							<kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
								Tab
							</kbd>{" "}
							to open the command menu.
						</p>
					</div>
				</form>
			</div>
			{submissionElement}
		</Fragment>
	);
});

export default PostEditorForm;
