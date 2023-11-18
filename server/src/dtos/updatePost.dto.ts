import { IsNotEmpty, IsString } from "class-validator";

class UpdatePostDto {
	@IsString({ message: "Title must be a string." })
	@IsNotEmpty({ message: "Title cannot be empty." })
	title: string;

	@IsString({ message: "Content must be a string." })
	@IsNotEmpty({ message: "Content cannot be empty." })
	content: string;
}

export default UpdatePostDto;
