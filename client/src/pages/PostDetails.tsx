import { clsx } from "clsx";
import { toast } from "react-toastify";
import { MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import useGetPost from "@/hooks/post/useGetPost.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import EditorOutput from "@/components/EditorOutput.tsx";
import ReactionType from "@/models/enums/ReactionType.ts";
import PostReactions from "@/components/PostReactions.tsx";
import CommentsSection from "@/components/CommentsSection.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";

const PostDetails = () => {
	const params = useParams<"postSlug">();
	const {
		data: post,
		isLoading: isFetchingPost,
		isError: isFetchPostError,
		error: fetchPostError,
	} = useGetPost({ postSlug: params.postSlug! });
	const { user } = useAppContext();

	if (isFetchPostError) {
		toast.error(fetchPostError.message);
	}

	if (isFetchingPost) {
		return (
			<div className="rounded-md bg-white shadow rounded">
				<div className="px-6 py-4 flex justify-between flex-col">
					<div className="w-full">
						<Skeleton className="rounded h-4 w-2/5 mb-3" />
						<Skeleton className="rounded h-4 w-1/4 mb-3" />
						<Skeleton className="rounded h-16 w-full" />
					</div>
				</div>
				<div className="bg-gray-50 p-4 sm:px-6 flex items-center gap-3 border-t border-gray-100">
					<Skeleton className="rounded h-4 w-10" />
					<Skeleton className="rounded h-4 w-10" />
					<Skeleton className="rounded h-4 w-10" />
				</div>
			</div>
		);
	} else if (post) {
		const likes = post.postReactions.filter(
			(reaction) => reaction.type === ReactionType.LIKE,
		).length;
		const unlikes = post.postReactions.filter(
			(reaction) => reaction.type === ReactionType.UNLIKE,
		).length;
		const ownReaction = post.postReactions.find((reaction) => reaction.userId === user?.id)
			?.type;

		return (
			<div className="h-full flex flex-col sm:flex-col items-center sm:items-start justify-between shadow rounded">
				<div className="w-full flex-1 bg-white p-4 rounded-sm">
					<p className="max-h-40 mt-1 truncate text-xs text-gray-500">
						<Link
							to={`/group/${post.group.id}`}
							className="underline text-blue-500 text-sm underline-offset-2"
						>
							{post.group.title}
						</Link>
						<span className="px-1">•</span>
						Posted by {post.creator.username}{" "}
						{formatTimeToNow(new Date(post.createdAt))}
					</p>
					<h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
						{post.title}
					</h1>

					<EditorOutput postContent={JSON.parse(post.content)} />

					<div className="text-sm flex items-center gap-3 w-full bg-white pt-3">
						<PostReactions
							postId={post.id}
							likeCount={likes}
							unlikeCount={unlikes}
							ownReaction={ownReaction}
						/>
						<Button
							variant="ghost"
							className="p-0 gap-2 hover:bg-transparent cursor-auto"
						>
							<MessageSquare
								className={clsx(
									"h-4 w-4 hover:text-teal-500 hover:scale-125 transform transition duration-100",
								)}
							/>{" "}
							{post.comments.filter((comment) => !comment.replyToCommentId).length}{" "}
							{/*{commentCount === 1 ? "comment" : "comments"}*/}
						</Button>
					</div>
					<CommentsSection postId={params.postSlug!} />
				</div>
			</div>
		);
	} else {
		return <div>Post does not exist</div>;
	}
};

export default PostDetails;
