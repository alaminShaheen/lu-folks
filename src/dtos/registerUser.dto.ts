import { IsEmail, IsString } from "class-validator";
import { Transform } from "class-transformer";

class RegisterUserDto {
	@IsString()
	@Transform((params) => params.value.trim())
	username: string;

	@IsEmail({}, { message: "Invalid email." })
	@Transform((params) => params.value.trim())
	email: string;

	@IsString()
	password: string;

	@IsString()
	confirmPassword: string;
}

export default RegisterUserDto;
