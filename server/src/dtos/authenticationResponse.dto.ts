import TokenDto from "@/dtos/token.dto";
import { User } from "@prisma/client";

class AuthenticationResponseDto {
	tokens: TokenDto;
	user: Pick<User, "email" | "username" | "imageUrl">;
}

export default AuthenticationResponseDto;
