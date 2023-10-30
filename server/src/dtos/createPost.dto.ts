import { IsJSON, IsNotEmpty, IsString } from "class-validator";

class CreatePostDto {
	@IsString({ message: "Title must be a string" })
	@IsNotEmpty({ message: "Title cannot be empty" })
	title: string;

	@IsJSON({ message: "Content invalid" })
	@IsNotEmpty({ message: "Content cannot be empty" })
	content: any;

	@IsString({ message: "Invalid group slug" })
	@IsNotEmpty({ message: "Need to specify group slug" })
	groupSlug: string;
}

export default CreatePostDto;
