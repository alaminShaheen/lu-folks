import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

class LoginUserDto {
	@IsString({ message: "Username must be a string." })
	@IsNotEmpty({ message: "Username cannot be empty." })
	@Transform((params) => params.value.trim())
	username: string;

	@IsString({ message: "Password must be a string." })
	@IsNotEmpty({ message: "Password cannot be empty." })
	password: string;
}

export default LoginUserDto;
