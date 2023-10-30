import CreateGroupDto from "@/dtos/createGroup.dto";
import { Group } from "@prisma/client";
import IsMemberResponse from "@/models/types/IsMemberResponse";
import GroupMemberCount from "@/models/types/GroupMemberCount";
import GroupInfo from "@/models/types/GroupInfo";

export default interface IGroupService {
	createGroup: (creatorId: string, groupInfo: CreateGroupDto) => Promise<Group>;
	getGroupData: (slug: string) => Promise<Group>;
	getGroupInfo: (slug: string) => Promise<GroupInfo>;
	isGroupMember: (slug: string, userId: string) => Promise<IsMemberResponse>;
	getGroupMemberCount: (slug: string) => Promise<GroupMemberCount>;
	joinGroup: (userId: string, slug: string) => Promise<void>;
	leaveGroup: (serId: string, slug: string) => Promise<void>;
}
