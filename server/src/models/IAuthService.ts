import TokenDto from "@/dtos/token.dto";
import LoginUserDto from "@/dtos/loginUser.dto";
import RegisterUserDto from "@/dtos/registerUser.dto";

interface IAuthService {
	register(userInfo: RegisterUserDto): Promise<TokenDto>;

	login(userInfo: LoginUserDto): Promise<TokenDto>;

	logout(userId: string): Promise<void>;

	refreshToken(cookies: Record<string, string>): Promise<Omit<TokenDto, "refreshToken">>;

	checkValidity(authorizationHeader: string | undefined): Promise<TokenValidityDto>;

	googleOAuthRegistration(code: string): Promise<TokenDto>;
}

export default IAuthService;
