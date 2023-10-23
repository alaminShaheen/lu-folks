import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

class LoginUserDto {
	@IsEmail({}, { message: "Invalid email" })
	@IsNotEmpty({ message: "Email cannot be empty" })
	@Transform((params) => params.value.trim())
	email: string;

	@IsString({ message: "Password must be a string." })
	@IsNotEmpty({ message: "Password cannot be empty." })
	password: string;
}

export default LoginUserDto;
