import GroupEntity from "@/database/entities/group.entity";
import CreateGroupDto from "@/dtos/createGroup.dto";

export default interface IGroupService {
	createGroup: (creatorId: string, groupInfo: CreateGroupDto) => Promise<GroupEntity>;
}
