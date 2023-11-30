import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

class UpdateUserDto {
	@IsString({ message: "Username must be a string." })
	@IsNotEmpty({ message: "Username cannot be empty." })
	@IsOptional()
	username: string;

	@IsEmail({}, { message: "Invalid email." })
	@Transform((params) => params.value.trim())
	@IsOptional()
	email: string;
}

export default UpdateUserDto;
