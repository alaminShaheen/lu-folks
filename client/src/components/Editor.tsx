import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.ts";
import APILinks from "@/constants/APILinks.ts";
import PostCreate from "@/models/form/PostCreate";
import useUploadFile from "@/hooks/useUploadFile.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import RichWysiwygEditor from "@/components/ui/wysiwygEditor.tsx";

const Editor = () => {
	const _titleRef = useRef<HTMLTextAreaElement>(null);
	const { user, authentication } = useAppContext();
	const [, setLoading] = useState(false);
	const { uploadFiles } = useUploadFile();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
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
				toast.dismiss();
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		},
		[uploadFiles, user?.id],
	);

	const onSubmit = useCallback((formData: PostCreate) => {
		console.log(formData);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			_titleRef?.current?.focus();
		}, 0);
	}, []);

	return (
		<div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
			<form id="subreddit-post-form" className="w-full" onSubmit={handleSubmit(onSubmit)}>
				<div className="w-full prose prose-stone dark:prose-invert">
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
					<Controller
						render={({ field: { name, onChange, value } }) => (
							<RichWysiwygEditor
								onChangeFn={onChange}
								data={value}
								authentication={authentication}
								editorBlockId={name}
								uploadImage={imageUploader}
							/>
						)}
						name="content"
						control={control}
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

export default Editor;
