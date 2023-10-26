import { IsNotEmpty, IsString } from "class-validator";

export default class CreateGroupDto {
	@IsString({ message: "Title must be a string." })
	@IsNotEmpty({ message: "Title cannot be empty." })
	title: string;
}
