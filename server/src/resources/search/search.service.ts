import { injectable } from "tsyringe";
import GroupService from "@/resources/groups/group.service";
import PostgresDatabase from "@/database/postgres.database";
import ISearchService from "@/models/interfaces/ISearchService";
import AppConstants from "@/constants/AppConstants";
import SearchResult from "@/models/types/SearchResult";

@injectable()
class SearchService implements ISearchService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly groupService: GroupService,
	) {}

	public getSearchResults = async (searchTerm: string): Promise<SearchResult> => {
		try {
			const groups = await this.databaseInstance.groupRepository.findMany({
				where: {
					title: { startsWith: searchTerm, mode: "insensitive" },
				},
				select: {
					title: true,
					id: true,
				},
				take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
			});

			const users = await this.databaseInstance.userRepository.findMany({
				where: {
					username: { startsWith: searchTerm, mode: "insensitive" },
				},
				select: {
					username: true,
					id: true,
					imageUrl: true,
				},
				take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
			});

			const posts = await this.databaseInstance.postRepository.findMany({
				where: {
					title: { startsWith: searchTerm, mode: "insensitive" },
				},
				select: {
					title: true,
					id: true,
					groupId: true,
				},
				take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
			});
			return {
				groups,
				posts,
				users,
			};
		} catch (error) {
			throw error;
		}
	};
}

export default SearchService;
