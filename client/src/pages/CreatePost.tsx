import { Link, useParams } from "react-router-dom";
import handleError from "@/utils/handleError.ts";
import CreatePostEditor from "@/components/CreatePostEditor.tsx";
import useFetchGroupInfo from "@/hooks/group/useFetchGroupInfo.tsx";

const CreatePost = () => {
	const params = useParams<"slug">();
	const {
		data: groupInfo,
		isFetching: fetchingGroup,
		isError: fetchGroupIsError,
		error: fetchGroupError,
	} = useFetchGroupInfo(params.slug!);

	if (fetchGroupIsError) {
		handleError(fetchGroupError);
	}

	return fetchingGroup || !groupInfo ? (
		<div>Loading...</div>
	) : (
		<div className="flex flex-col items-start gap-6">
			{/* heading */}
			<div className="border-b border-gray-200 pb-5">
				<div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
					<h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-gray-400">
						Create Post
					</h3>
					<p className="ml-2 truncate text-sm text-blue-500 dark:text-blue-400">
						in <Link to={`/group/${params.slug}`}>{groupInfo.title}</Link>
					</p>
				</div>
			</div>
			{/* form */}
			<CreatePostEditor groupSlug={groupInfo.id} />
		</div>
	);
};

export default CreatePost;
