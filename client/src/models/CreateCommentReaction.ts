import ReactionType from "@/models/enums/ReactionType.ts";

type CreateCommentReaction = {
	reaction: ReactionType;
	commentSlug: string;
};

export default CreateCommentReaction;
