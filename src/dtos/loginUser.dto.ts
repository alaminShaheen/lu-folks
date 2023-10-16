import { IsString } from "class-validator";
import { Transform } from "class-transformer";

class LoginUserDto {
	@IsString()
	@Transform((params) => params.value.trim())
	username: string;

	@IsString()
	password: string;
}

export default LoginUserDto;
