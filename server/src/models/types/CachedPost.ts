import { Post, ReactionType } from "@prisma/client";

type CachedPost =
	| Pick<Post, "title" | "content" | "createdAt" | "id">
	| {
			creatorUsername: string;
			currentUserReaction: ReactionType;
	  };

export default CachedPost;
