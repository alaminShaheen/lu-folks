import CreateGroupDto from "@/dtos/createGroup.dto";
import { Group } from "@prisma/client";
import GroupInfo from "@/models/types/GroupInfo";

export default interface IGroupService {
	createGroup: (creatorId: string, groupInfo: CreateGroupDto) => Promise<Group>;
	getGroupData: (slug: string) => Promise<Group>;
	getGroupInfo: (slug: string, userId: string) => Promise<GroupInfo>;
	joinGroup: (userId: string, slug: string) => Promise<void>;
	leaveGroup: (serId: string, slug: string) => Promise<void>;
}
