import { Group } from "@prisma/client";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import GroupInfo from "@/models/types/GroupInfo";
import AppConstants from "@/constants/AppConstants";
import HttpException from "@/exceptions/httpException";
import IGroupService from "@/models/interfaces/IGroupService";
import CreateGroupDto from "@/dtos/createGroup.dto";
import PostgresDatabase from "@/database/postgres.database";
import IsMemberResponse from "@/models/types/IsMemberResponse";
import FieldValidationException from "@/exceptions/fieldValidationException";
import * as console from "console";
import SuggestedGroupInfo from "@/models/types/SuggestedGroupInfo";
import PaginatedResponse from "@/models/PaginatedResponse";

@injectable()
class GroupService implements IGroupService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	public groupSuggestions = async (
		userId: string,
		cursorId?: string,
	): Promise<PaginatedResponse<SuggestedGroupInfo>> => {
		try {
			const groups = await this.databaseInstance.groupRepository.findMany({
				where: { groupMembers: { none: { id: userId } } },
				include: {
					_count: { select: { groupMembers: true } },
				},
				cursor: cursorId ? { id: cursorId } : undefined,
				skip: cursorId ? 1 : undefined,
				take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
			});

			return {
				nextId:
					groups.length === AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH
						? groups[groups.length - 1].id
						: undefined,
				data: groups.map((group) => ({
					title: group.title,
					id: group.id,
					groupMemberCount: group._count.groupMembers,
					updatedAt: group.updatedAt,
					creatorId: group.creatorId,
					createdAt: group.createdAt,
				})),
			};
		} catch (error) {
			throw error;
		}
	};

	public checkGroupExistence = async (slug: string): Promise<Group> => {
		try {
			const group = await this.databaseInstance.groupRepository.findFirst({
				where: { id: slug },
			});

			if (!group) {
				console.log("Group does not exist.");
				throw new HttpException(httpStatus.BAD_REQUEST, "The group does not exist");
			}

			return group;
		} catch (error) {
			throw error;
		}
	};

	public getGroupInfo = async (slug: string, userId: string): Promise<GroupInfo> => {
		try {
			const groupExists = await this.checkGroupExistence(slug);

			const group = await this.databaseInstance.groupRepository.findFirst({
				where: { id: slug },
				include: {
					_count: {
						select: {
							groupMembers: true,
						},
					},
				},
			});
			const { isMember } = await this.isGroupMember(slug, userId);

			if (!group) {
				console.log(`No group found with slug: ${slug}`);
				throw new HttpException(httpStatus.NOT_FOUND, "No group found.");
			}

			return {
				isMember,
				id: group.id,
				title: group.title,
				createdAt: group.createdAt,
				creatorId: group.creatorId,
				groupMemberCount: group._count.groupMembers,
				updatedAt: group.updatedAt,
			};
		} catch (error) {
			throw error;
		}
	};

	public leaveGroup = async (userId: string, slug: string): Promise<void> => {
		try {
			const groupWithCreator = await this.databaseInstance.groupRepository.findUnique({
				where: { id: slug },
				include: {
					creator: { select: { id: true } },
				},
			});
			const { isMember } = await this.isGroupMember(slug, userId);

			if (!groupWithCreator) {
				console.log("Group does not exist.");
				throw new HttpException(httpStatus.BAD_REQUEST, "The group does not exist");
			} else if (groupWithCreator.creator.id === userId) {
				console.log("Group creator cannot leave group.");
				throw new HttpException(
					httpStatus.NOT_ACCEPTABLE,
					"Group creator cannot leave group",
				);
			} else if (!isMember) {
				console.log("User must be a member of the group.");
				throw new HttpException(
					httpStatus.NOT_ACCEPTABLE,
					"User must be a member of the group",
				);
			}
			await this.databaseInstance.groupRepository.update({
				where: { id: slug },
				data: {
					groupMembers: { disconnect: { id: userId } },
				},
			});
			return;
		} catch (error) {
			throw error;
		}
	};

	public joinGroup = async (userId: string, slug: string): Promise<void> => {
		try {
			const groupWithCreator = await this.databaseInstance.groupRepository.findUnique({
				where: { id: slug },
				include: {
					creator: { select: { id: true } },
				},
			});
			const { isMember } = await this.isGroupMember(slug, userId);

			if (!groupWithCreator) {
				console.log("Group does not exist.");
				throw new HttpException(httpStatus.BAD_REQUEST, "The group does not exist");
			} else if (groupWithCreator.creator.id === userId || isMember) {
				console.log("User is already member of this group.");
				throw new HttpException(
					httpStatus.BAD_REQUEST,
					"User is already member of this group",
				);
			}

			await this.databaseInstance.groupRepository.update({
				where: { id: slug },
				data: {
					groupMembers: { connect: { id: userId } },
				},
			});
			return;
		} catch (error) {
			throw error;
		}
	};

	public isGroupMember = async (slug: string, userId: string): Promise<IsMemberResponse> => {
		try {
			const group = await this.databaseInstance.groupRepository.findUnique({
				where: { id: slug, groupMembers: { some: { id: userId } } },
			});
			return { isMember: !!group };
		} catch (error: any) {
			throw error;
		}
	};

	public getGroupData = async (slug: string): Promise<Group> => {
		try {
			await this.checkGroupExistence(slug);

			const group = await this.databaseInstance.groupRepository.findFirst({
				where: { id: slug },
				include: {
					posts: {
						include: {
							creator: true,
							postReactions: true,
							comments: true,
							group: true,
						},
						orderBy: {
							createdAt: "desc",
						},
						take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
					},
					creator: {
						select: {
							id: true,
							username: true,
							imageUrl: true,
						},
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
			const existingGroupWithSameTitle =
				await this.databaseInstance.groupRepository.findFirst({
					where: { title: groupInfo.title },
				});

			if (existingGroupWithSameTitle) {
				throw new FieldValidationException(httpStatus.BAD_REQUEST, {
					title: "Group with same name already exists.",
				});
			}

			return await this.databaseInstance.groupRepository.create({
				data: {
					title: groupInfo.title,
					creator: { connect: { id: creatorId } },
					groupMembers: { connect: { id: creatorId } },
				},
			});
		} catch (error: any) {
			throw error;
		}
	};
}

export default GroupService;
