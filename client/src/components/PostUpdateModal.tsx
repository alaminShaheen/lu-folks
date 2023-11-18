import { useCallback, useRef } from "react";
import ModalProps from "@/models/ModalProps.ts";
import PostEditorForm, { PostForm } from "@/components/PostEditorForm.tsx";
import ExtendedPost from "@/models/ExtendedPost.ts";
import UpdatePost from "@/models/form/UpdatePost.ts";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { EditorHandle } from "@/components/ui/wysiwygEditor.tsx";

const POST_FORM_UPDATE_ID = "post-update-form";

type PostUpdateModalProps = {
	onAction: (data: UpdatePost) => void;
	post: ExtendedPost;
} & ModalProps;

const PostUpdateModal = (props: PostUpdateModalProps) => {
	const { post, onAction, modalTitle, toggle, open, modalDescription } = props;
	const richTextEditorRef = useRef<EditorHandle>(null);

	const onSubmit = useCallback(
		async (data: PostForm) => {
			const content = await richTextEditorRef.current?.save();
			onAction({ postId: post.id, content: JSON.stringify(content), title: data.title });
		},
		[onAction],
	);

	return (
		<Dialog open={open}>
			<DialogContent onClose={toggle}>
				<DialogHeader>
					<DialogTitle>{modalTitle}</DialogTitle>
					<DialogDescription>{modalDescription}</DialogDescription>
				</DialogHeader>
				<PostEditorForm
					formId={POST_FORM_UPDATE_ID}
					onSubmit={onSubmit}
					ref={richTextEditorRef}
					defaultContent={JSON.parse(post.content)}
					defaultTitle={post.title}
					editorClassName="min-h-auto"
					submissionElement={
						<DialogFooter>
							<Button type="button" variant="ghost" onClick={toggle}>
								Close
							</Button>
							<Button type="submit" form={POST_FORM_UPDATE_ID}>
								Save changes
							</Button>
						</DialogFooter>
					}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default PostUpdateModal;
