import { IsEmail, IsString } from "class-validator";

class CreateUserDto {
	@IsString()
	name: string;

	@IsEmail({}, { message: "Invalid email." })
	email: string;

	@IsString()
	password: string;
}

export default CreateUserDto;
