import { Group, Post, User } from "@prisma/client";

type SearchResult = {
	posts: Pick<Post, "id" | "title" | "groupId">[];
	groups: Pick<Group, "id" | "title">[];
	users: Pick<User, "id" | "imageUrl" | "username">[];
};

export default SearchResult;
