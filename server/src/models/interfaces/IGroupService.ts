import CreateGroupDto from "@/dtos/createGroup.dto";
import { Group } from "@prisma/client";
import GroupInfo from "@/models/types/GroupInfo";
import SuggestedGroupInfo from "@/models/types/SuggestedGroupInfo";
import PaginatedResponse from "@/models/PaginatedResponse";

export default interface IGroupService {
	createGroup: (creatorId: string, groupInfo: CreateGroupDto) => Promise<Group>;
	getGroupData: (slug: string) => Promise<Group>;
	getGroupInfo: (slug: string, userId: string) => Promise<GroupInfo>;
	joinGroup: (userId: string, slug: string) => Promise<void>;
	leaveGroup: (userId: string, slug: string) => Promise<void>;
	groupSuggestions: (
		userId: string,
		cursorId?: string,
	) => Promise<PaginatedResponse<SuggestedGroupInfo>>;
}
