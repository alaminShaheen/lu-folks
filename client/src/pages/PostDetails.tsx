import { clsx } from "clsx";
import { toast } from "react-toastify";
import { MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useGetPost from "@/hooks/post/useGetPost.tsx";
import EditorOutput from "@/components/EditorOutput.tsx";
import ReactionType from "@/models/enums/ReactionType.ts";
import PostReactions from "@/components/PostReactions.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";

const PostDetails = () => {
	const params = useParams<"postSlug">();
	const { data: post, isLoading, isError, error } = useGetPost({ postSlug: params.postSlug! });
	const { user } = useAppContext();

	if (isError) {
		toast.error(error.message);
	}

	if (isLoading) {
		return <div>Loading...</div>;
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
			<div>
				<div className="h-full flex flex-col sm:flex-col items-center sm:items-start justify-between">
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
						{/*<Suspense fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}>*/}
						{/*	/!* @ts-expect-error Server Component *!/*/}
						{/*	<CommentsSection postId={post?.id ?? cachedPost.id} />*/}
						{/*</Suspense>*/}
					</div>
					<div className="text-sm px-4 sm:px-6 flex items-center gap-3 border-t border-gray-100 bg-white w-full">
						<PostReactions
							postId={post.id}
							likeCount={likes}
							unlikeCount={unlikes}
							ownReaction={ownReaction}
						/>
						<Link
							to={"/"}
							// href={`/r/${subredditName}/post/${post.id}`}
							className="w-fit flex items-center gap-2"
						>
							<MessageSquare
								className={clsx(
									"h-4 w-4 hover:text-teal-500 hover:scale-125 transform transition duration-100",
								)}
							/>{" "}
							{post.comments.length}{" "}
							{/*{commentCount === 1 ? "comment" : "comments"}*/}
						</Link>
					</div>
				</div>
			</div>
		);
	} else {
		return <div>Post does not exist</div>;
	}
};

export default PostDetails;
