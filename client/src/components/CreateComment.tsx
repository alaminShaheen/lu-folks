import { useForm } from "react-hook-form";
import { useCallback } from "react";
import QueryKeys from "@/constants/QueryKeys.ts";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea";
import useCreateComment from "@/hooks/comment/useCreateComment.tsx";
import { useQueryClient } from "@tanstack/react-query";

type CreateCommentProps = {
	postId: string;
};
const CreateComment = (props: CreateCommentProps) => {
	const { postId } = props;
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm<{ comment: string }>({
		defaultValues: {
			comment: "",
		},
	});
	const currentComment = watch("comment");
	const queryClient = useQueryClient();

	const onCommentPosted = useCallback(async () => {
		reset({ comment: "" });
		await queryClient.refetchQueries({ queryKey: [QueryKeys.GET_POST, postId] });
		await queryClient.refetchQueries({ queryKey: [QueryKeys.GET_POST_COMMENTS, postId] });
	}, [queryClient]);

	const { mutate: submitComment, isPending } = useCreateComment({ onSuccess: onCommentPosted });

	const onSubmit = useCallback(
		(data: { comment: string }) => {
			submitComment({ comment: data.comment, postId });
		},
		[submitComment],
	);

	return (
		<form className="grid w-full gap-1.5" onSubmit={handleSubmit(onSubmit)}>
			<Label htmlFor="comment">Your comment</Label>
			<div className="mt-2">
				<Textarea
					id="comment"
					rows={1}
					placeholder="What are your thoughts?"
					{...register("comment", { required: "Comment is required." })}
				/>

				{errors.comment?.message && (
					<span className="text-xs text-red-500 my-2">{errors.comment.message}</span>
				)}

				<div className="mt-2 flex justify-end">
					<Button
						loading={isPending}
						disabled={currentComment.length === 0}
						type="submit"
					>
						Post
					</Button>
				</div>
			</div>
		</form>
	);
};

export default CreateComment;
