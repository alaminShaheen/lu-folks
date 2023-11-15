import { useRef, useState } from "react";
import UserAvatar from "@/components/UserAvatar.tsx";
import Comment from "@/models/Comment.ts";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";
import { Button } from "@/components/ui/button.tsx";
import { Reply } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import CommentReactions from "@/components/CommentReactions.tsx";
import ReactionType from "@/models/enums/ReactionType.ts";

type PostCommentProps = {
	comment: Comment;
	likeCount: number;
	unlikeCount: number;
	ownReaction?: ReactionType;
};

const PostComment = (props: PostCommentProps) => {
	const { comment, unlikeCount, ownReaction, likeCount } = props;
	const [isReplying, setIsReplying] = useState(false);
	const commentRef = useRef<HTMLDivElement>(null);
	// const {mutate: createComment} = useCreateComment({onSuccess: () => {}});

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
					commentId={comment.id}
					likeCount={likeCount}
					unlikeCount={unlikeCount}
					ownReaction={ownReaction}
				/>

				<Reply
					className="h-4 w-4 mr-1.5 cursor-pointer"
					onClick={() => {
						setIsReplying(true);
					}}
				/>
				{/*<Button*/}

				{/*	}}*/}
				{/*	variant="ghost"*/}
				{/*	size="icon"*/}
				{/*	className="p-0 m-0"*/}
				{/*>*/}
				{/*	/!*Reply*!/*/}
				{/*</Button>*/}
			</div>

			{isReplying ? (
				<div className="grid w-full gap-1.5">
					<Label htmlFor="comment">Your Reply</Label>
					<form className="mt-2">
						<Textarea
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

						<div className="mt-2 flex justify-end gap-2">
							<Button
								tabIndex={-1}
								variant="ghost"
								onClick={() => setIsReplying(false)}
							>
								Cancel
							</Button>
							<Button onClick={() => {}}>Post</Button>
						</div>
					</form>
				</div>
			) : null}
		</div>
	);
};

export default PostComment;
