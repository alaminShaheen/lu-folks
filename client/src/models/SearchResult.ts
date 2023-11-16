import User from "@/models/User.ts";
import GroupInfo from "@/models/GroupInfo.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";

type SearchResult = {
	posts: Pick<ExtendedPost, "id" | "title">[];
	groups: Pick<GroupInfo, "id" | "title">[];
	users: Pick<User, "id" | "imageUrl" | "username">[];
};

export default SearchResult;
