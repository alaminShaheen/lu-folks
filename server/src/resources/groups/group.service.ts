import httpStatus from "http-status";
import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import UserService from "@/resources/users/user.service";
import GroupEntity from "@/database/entities/group.entity";
import HttpException from "@/exceptions/httpException";
import IGroupService from "@/models/interfaces/IGroupService";
import CreateGroupDto from "@/dtos/createGroup.dto";
import FieldValidationException from "@/exceptions/fieldValidationException";

@injectable()
class GroupService implements IGroupService {
	private readonly groupRepository: Repository<GroupEntity>;

	constructor(private readonly userService: UserService) {}

	public createGroup = async (
		creatorId: string,
		groupInfo: CreateGroupDto,
	): Promise<GroupEntity> => {
		try {
			const creator = await this.userService.getUserById(creatorId);

			if (!creator) {
				throw new HttpException(httpStatus.FORBIDDEN, "User is not authenticated.");
			}

			const existingGroupWithSameTitle = await this.groupRepository.findOneBy({
				title: groupInfo.title,
			});

			if (existingGroupWithSameTitle) {
				throw new FieldValidationException(httpStatus.FORBIDDEN, {
					title: "Group with same name already exists.",
				});
			}

			const unsavedNewGroup = this.groupRepository.create({
				title: groupInfo.title,
				members: [creator],
				createdBy: creator,
			});

			const newGroup = await this.groupRepository.save(unsavedNewGroup);

			creator.createdGroups.push(newGroup);
			await this.userService.saveUser(creator);
			return newGroup;
		} catch (error: any) {
			throw error;
		}
	};
}

export default GroupService;
