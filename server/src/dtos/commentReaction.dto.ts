import { ReactionType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

class CommentReactionDto {
	@IsEnum(ReactionType)
	@IsNotEmpty({ message: "Comment reaction cannot be empty" })
	reaction: ReactionType;

	@IsString({ message: "Comment slug must be a string" })
	@IsNotEmpty({ message: "Comment reaction cannot be empty" })
	commentSlug: string;
}

export default CommentReactionDto;
