import CreateGroupDto from "@/dtos/createGroup.dto";
import { Group } from "@prisma/client";

export default interface IGroupService {
	createGroup: (creatorId: string, groupInfo: CreateGroupDto) => Promise<Group>;
	getGroup: (slug: string) => Promise<Group>;
}
