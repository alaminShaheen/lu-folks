import TokenDto from "@/dtos/token.dto";
import UserEntity from "@/database/entities/user.entity";

class AuthenticationResponseDto {
	tokens: TokenDto;
	user: Pick<UserEntity, "email" | "username" | "imageUrl">;
}

export default AuthenticationResponseDto;
