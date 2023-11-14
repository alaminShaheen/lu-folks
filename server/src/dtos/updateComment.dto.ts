import { IsNotEmpty, IsString } from "class-validator";

export default class UpdateCommentDto {
	@IsString({ message: "Comment must be a string." })
	@IsNotEmpty({ message: "Comment cannot be empty." })
	comment: string;

	@IsNotEmpty({ message: "CommentId cannot be empty." })
	commentId: string;
}
