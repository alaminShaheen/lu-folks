import CreateGroupDto from "@/dtos/createGroup.dto";
import { Group } from "@prisma/client";
import IsMemberResponse from "@/models/types/IsMemberResponse";
import GroupMemberCount from "@/models/types/GroupMemberCount";

export default interface IGroupService {
	createGroup: (creatorId: string, groupInfo: CreateGroupDto) => Promise<Group>;
	getGroup: (slug: string) => Promise<Group>;
	isGroupMember: (slug: string, userId: string) => Promise<IsMemberResponse>;
	getGroupMemberCount: (slug: string) => Promise<GroupMemberCount>;
	joinGroup: (userId: string, slug: string) => Promise<void>;
	leaveGroup: (serId: string, slug: string) => Promise<void>;
}
