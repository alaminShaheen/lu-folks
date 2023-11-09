import { useParams } from "react-router-dom";
import useGetPost from "@/hooks/post/useGetPost.tsx";
import EditorOutput from "@/components/EditorOutput.tsx";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";
import { toast } from "react-toastify";

const PostDetails = () => {
	const params = useParams<"postSlug">();
	const { data: post, isLoading, isError, error } = useGetPost({ postSlug: params.postSlug! });
	console.log(post?.content);
	if (isError) {
		toast.error(error.message);
	}

	return isLoading || !post ? (
		<div>Loading...</div>
	) : (
		<div>
			<div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
				{/*<Suspense fallback={<PostVoteShell />}>*/}
				{/*	/!* @ts-expect-error server component *!/*/}
				{/*	<PostVoteServer*/}
				{/*		postId={post?.id ?? cachedPost.id}*/}
				{/*		getData={async () => {*/}
				{/*			return await db.post.findUnique({*/}
				{/*				where: {*/}
				{/*					id: params.postId,*/}
				{/*				},*/}
				{/*				include: {*/}
				{/*					votes: true,*/}
				{/*				},*/}
				{/*			})*/}
				{/*		}}*/}
				{/*	/>*/}
				{/*</Suspense>*/}

				<div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
					<p className="max-h-40 mt-1 truncate text-xs text-gray-500">
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
			</div>
		</div>
	);
};

export default PostDetails;
