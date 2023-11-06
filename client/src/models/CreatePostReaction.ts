import ReactionType from "@/models/enums/ReactionType.ts";

type CreatePostReaction = {
	reaction: ReactionType;
	postSlug: string;
};

export default CreatePostReaction;
