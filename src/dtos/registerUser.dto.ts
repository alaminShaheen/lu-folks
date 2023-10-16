import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class RegisterUserDto {
	@IsString({ message: "Username must be a string." })
	@IsNotEmpty({ message: "Username cannot be empty." })
	@Transform((params) => params.value.trim())
	username: string;

	@IsEmail({}, { message: "Invalid email." })
	@Transform((params) => params.value.trim())
	email: string;

	@IsString({ message: "Password must be a string." })
	@IsNotEmpty({ message: "Password cannot be empty." })
	password: string;

	@IsString({ message: "Confirm password must be a string." })
	@IsNotEmpty({ message: "Confirm password cannot be empty." })
	confirmPassword: string;
}

export default RegisterUserDto;
