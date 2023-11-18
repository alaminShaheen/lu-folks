import { useCallback } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import UpdateComment from "@/models/form/UpdateComment.ts";
import ModalProps from "@/models/ModalProps.ts";

type CommentUpdateModalProps = {
	currentComment: string;
	onAction: (data: UpdateComment) => void;
	commentId: string;
} & ModalProps;

type CommentUpdateForm = {
	comment: string;
};

const CommentUpdateModal = (props: CommentUpdateModalProps) => {
	const { modalDescription, modalTitle, currentComment, onAction, commentId, open, toggle } =
		props;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CommentUpdateForm>({
		defaultValues: {
			comment: currentComment,
		},
	});

	const onSubmit = useCallback(
		(data: CommentUpdateForm) => {
			onAction({ comment: data.comment, commentId: commentId });
		},
		[commentId, onAction],
	);

	return (
		<Dialog open={open}>
			<DialogContent onClose={toggle}>
				<DialogHeader>
					<DialogTitle>{modalTitle}</DialogTitle>
					<DialogDescription>{modalDescription}</DialogDescription>
				</DialogHeader>
				<form
					className="grid gap-4 py-4"
					id="comment-update-form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-4">
						<Label htmlFor="comment" className="">
							Comment
						</Label>
						<Input
							id="comment"
							className="col-span-3"
							{...register("comment", { required: "Comment is required" })}
						/>
						{errors.comment?.message && (
							<span className="text-xs text-red-500 my-2">
								{errors.comment.message}
							</span>
						)}
					</div>
				</form>
				<DialogFooter>
					<Button type="button" variant="ghost" onClick={toggle}>
						Close
					</Button>
					<Button type="submit" form="comment-update-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CommentUpdateModal;
