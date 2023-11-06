import { ReactionType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

class PostReactionDto {
	@IsEnum(ReactionType)
	@IsNotEmpty({ message: "Post reaction cannot be empty" })
	reaction: ReactionType;

	@IsString({ message: "Post slug must be a string" })
	@IsNotEmpty({ message: "Post reaction cannot be empty" })
	postSlug: string;
}

export default PostReactionDto;
