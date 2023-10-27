import httpStatus from "http-status";
import { injectable } from "tsyringe";
import UserService from "@/resources/users/user.service";
import HttpException from "@/exceptions/httpException";
import IGroupService from "@/models/interfaces/IGroupService";
import CreateGroupDto from "@/dtos/createGroup.dto";
import FieldValidationException from "@/exceptions/fieldValidationException";
import PostgresDatabase from "@/database/postgres.database";
import { Group } from "@prisma/client";
import AppConstants from "@/constants/AppConstants";

@injectable()
class GroupService implements IGroupService {
	constructor(
		private readonly userService: UserService,
		private readonly databaseInstance: PostgresDatabase,
	) {}

	public getGroup = async (slug: string): Promise<Group> => {
		try {
			const group = await this.databaseInstance.groupRepository.findFirst({
				where: { id: slug },
				include: {
					posts: {
						include: {
							creator: true,
							postReactors: true,
							comments: true,
							group: true,
						},
						take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
					},
				},
			});

			if (!group) {
				console.log(`No group found with slug: ${slug}`);
				throw new HttpException(httpStatus.NOT_FOUND, "No group found.");
			}

			return group;
		} catch (error: any) {
			throw error;
		}
	};

	public createGroup = async (creatorId: string, groupInfo: CreateGroupDto): Promise<Group> => {
		try {
			const creator = await this.userService.getUserById(creatorId);

			if (!creator) {
				throw new HttpException(httpStatus.FORBIDDEN, "User is not authenticated.");
			}

			const existingGroupWithSameTitle =
				await this.databaseInstance.groupRepository.findFirst({
					where: { title: groupInfo.title },
				});

			if (existingGroupWithSameTitle) {
				throw new FieldValidationException(httpStatus.FORBIDDEN, {
					title: "Group with same name already exists.",
				});
			}

			return await this.databaseInstance.groupRepository.create({
				data: {
					title: groupInfo.title,
					creatorId,
				},
			});
		} catch (error: any) {
			throw error;
		}
	};
}

export default GroupService;
