import { Fragment } from "react";
import MiniCreatePost from "@/components/MiniCreatePost.tsx";
import { useParams } from "react-router-dom";
import useFetchGroupDetails from "@/hooks/group/useFetchGroupDetails.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import handleError from "@/utils/handleError.ts";

const GroupDetails = () => {
	const params = useParams<"slug">();
	const {
		data: group,
		isFetching: fetchingGroup,
		isError: fetchGroupIsError,
		error: fetchGroupError,
	} = useFetchGroupDetails(params.slug!);

	if (fetchGroupIsError) {
		handleError(fetchGroupError);
	}

	return (
		<Fragment>
			{fetchingGroup ? (
				<Skeleton className="rounded h-11 w-1/2" />
			) : (
				<h1 className="font-bold text-3xl md:text-4xl h-14">{group.title}</h1>
			)}

			<MiniCreatePost />
			{/*	Show posts*/}
		</Fragment>
	);
};

export default GroupDetails;
