import RegisterUserDto from "@/dtos/registerUser.dto";
import TokenDto from "@/dtos/token.dto";
import LoginUserDto from "@/dtos/loginUser.dto";

interface IAuthService {
	register(userInfo: RegisterUserDto): Promise<TokenDto>;

	login(userInfo: LoginUserDto): Promise<TokenDto>;

	logout(userId: number): Promise<void>;

	refreshToken(
		cookies: Record<string, string>,
		userId: number,
	): Promise<Omit<TokenDto, "refreshToken">>;
}

export default IAuthService;
