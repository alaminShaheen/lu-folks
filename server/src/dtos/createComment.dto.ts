import { IsNotEmpty, IsString } from "class-validator";

export default class CreateCommentDto {
	@IsString({ message: "Comment must be a string." })
	@IsNotEmpty({ message: "Comment cannot be empty." })
	comment: string;

	@IsNotEmpty({ message: "PostId cannot be empty." })
	postId: string;
}
