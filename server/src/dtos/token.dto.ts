import { IsString } from "class-validator";

class TokenDto {
	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;
}

export default TokenDto;
