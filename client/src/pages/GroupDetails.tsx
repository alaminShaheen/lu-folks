import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import Group from "@/models/Group";
import APILinks from "@/constants/APILinks.ts";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import MiniCreatePost from "@/components/MiniCreatePost.tsx";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";

const GroupDetails = () => {
	const params = useParams<"slug">();
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const [groupInfo, setGroupInfo] = useState<Group>(Group.EMPTY);
	const [, setLoading] = useState(false);
	console.log(params.slug);

	const fetchGroupDetails = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.get<Group>(APILinks.getGroup(params.slug!));
			setGroupInfo(
				new Group(data.id, data.title, data.createdAt, data.updatedAt, data.posts),
			);
		} catch (error: any) {
			toast.dismiss();
			if (error.response.data.type === ApiErrorType.GENERAL) {
				toast.error(error.response.data.message);
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, params.slug]);

	useEffect(() => {
		void fetchGroupDetails();
	}, [fetchGroupDetails]);

	return (
		<Fragment>
			<h1 className="font-bold text-3xl md:text-4xl h-14">{groupInfo.title}</h1>
			<MiniCreatePost />
		</Fragment>
	);
};

export default GroupDetails;
