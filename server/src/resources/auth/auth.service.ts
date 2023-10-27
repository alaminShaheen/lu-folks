import qs from "qs";
import axios from "axios";
import bcrypt from "bcrypt";
import process from "process";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import TokenDto from "@/dtos/token.dto";
import UserService from "@/resources/users/user.service";
import LoginUserDto from "@/dtos/loginUser.dto";
import IAuthService from "@/models/interfaces/IAuthService";
import AppConstants from "@/constants/AppConstants";
import TokenPayload from "@/models/types/tokenPayload";
import HttpException from "@/exceptions/httpException";
import RegisterUserDto from "@/dtos/registerUser.dto";
import { AuthProvider } from "@prisma/client";
import PostgresDatabase from "@/database/postgres.database";
import GoogleOAuthUserResponse from "@/models/types/GoogleOAuthUserResponse";
import FieldValidationException from "@/exceptions/fieldValidationException";
import GoogleOAuthTokenResponse from "@/models/types/GoogleOAuthTokenResponse";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

@injectable()
class AuthService implements IAuthService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly userService: UserService,
	) {}

	public checkValidity = async (
		authorizationHeader: string | undefined,
	): Promise<TokenValidityDto> => {
		try {
			if (!authorizationHeader) {
				console.error("No authorization header present in request.");
				throw new HttpException(httpStatus.FORBIDDEN, "User is unauthorized");
			}

			// authHeader = "Bearer <<token>>
			const token = authorizationHeader.split(" ")[1];

			const decodedToken = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));

			const currentTimestamp = Math.floor(Date.now() / 1000);

			if ((decodedToken as JwtPayload)?.exp) {
				const expiresIn = (decodedToken as JwtPayload).exp! - currentTimestamp;
				return { hasExpired: false, time_left: `${expiresIn / 60} minutes` };
			} else {
				console.error("Access token expired.");
				throw new HttpException(httpStatus.UNAUTHORIZED, "Access token expired.");
			}
		} catch (error) {
			throw error;
		}
	};

	public refreshToken = async (
		cookies: Record<string, string>,
	): Promise<Omit<TokenDto, "refreshToken">> => {
		const refreshToken = cookies.jwt;

		if (!refreshToken) {
			console.error("No refresh token present.");
			throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthorized.");
		}

		try {
			const session = await this.databaseInstance.sessionRepository.findFirst({
				where: { refreshToken },
				include: { user: true },
			});

			if (!session || !session.user) {
				console.error("No session or user associated with refresh token.");
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthorized.");
			}

			const dbUser = session.user;

			const decodedUserInfo = jwt.verify(
				refreshToken,
				String(process.env.REFRESH_TOKEN_SECRET),
			) as TokenPayload;

			if (
				!decodedUserInfo ||
				decodedUserInfo.userId !== dbUser.id ||
				decodedUserInfo.username !== dbUser.username
			) {
				console.error("Refresh token tampered as not identical with user in db.");
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthorized.");
			}

			const accessToken = this.createAccessToken({
				username: decodedUserInfo.username,
				userId: decodedUserInfo.userId,
			});

			return { accessToken };
		} catch (error) {
			if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
				console.error("Refresh token has expired.");
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthorized.");
			} else {
				throw error;
			}
		}
	};

	public login = async (userInfo: LoginUserDto): Promise<TokenDto> => {
		const { email, password } = userInfo;

		try {
			const user = await this.databaseInstance.userRepository.findFirst({ where: { email } });
			if (!user || user.authProvider === AuthProvider.GOOGLE) {
				console.error("Incorrect credentials provided.");
				throw new HttpException(httpStatus.BAD_REQUEST, "Incorrect login credentials");
			} else if (user.authProvider === AuthProvider.VANILLA && user.password) {
				const isCorrectPassword = await bcrypt.compare(password, user.password);
				if (!isCorrectPassword) {
					console.error("Password did not match.");
					throw new HttpException(httpStatus.BAD_REQUEST, "Incorrect login credentials");
				}
			}

			const accessToken = this.createAccessToken({
				username: user.username,
				userId: user.id,
			});

			const refreshToken = this.createRefreshToken({
				username: user.username,
				userId: user.id,
			});

			const session = this.databaseInstance.sessionRepository.create({
				data: { refreshToken, userId: user.id },
			});

			return { accessToken, refreshToken };
		} catch (error) {
			throw error;
		}
	};

	public logout = async (userId: string) => {
		try {
			const user = await this.databaseInstance.userRepository.findFirst({
				where: { id: userId },
				include: { session: true },
			});

			if (!user || !user.session) {
				console.error(`User is unauthenticated as no user with ${userId} found.`);
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthenticated");
			}
			await this.databaseInstance.sessionRepository.delete({
				where: { id: user.session.id },
			});
		} catch (error) {
			throw error;
		}
	};

	public register = async (userInfo: RegisterUserDto): Promise<TokenDto> => {
		const { confirmPassword, email, password, username } = userInfo;

		if (password !== confirmPassword) {
			console.error("Password and Confirm password don't match.");
			throw new FieldValidationException(httpStatus.BAD_REQUEST, {
				confirmPassword: "Passwords do not match.",
			});
		}

		try {
			const userWithSameEntries = await this.databaseInstance.userRepository.findMany({
				where: {
					OR: [{ username }, { email }],
				},
			});

			if (userWithSameEntries && userWithSameEntries.length > 0) {
				if (userWithSameEntries[0].email === email) {
					console.error("Email already in use.");
					throw new FieldValidationException(httpStatus.BAD_REQUEST, {
						email: "User with email already exists.",
					});
				} else {
					console.error("Username already exists.");
					throw new FieldValidationException(httpStatus.BAD_REQUEST, {
						username: "Username not available.",
					});
				}
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const finalUser = await this.userService.createAndSaveUser({
				email,
				password: hashedPassword,
				username,
			});

			const accessToken = this.createAccessToken({
				username: finalUser.username,
				userId: finalUser.id,
			});

			const refreshToken = this.createRefreshToken({
				username: finalUser.username,
				userId: finalUser.id,
			});

			const newUserSession = this.databaseInstance.sessionRepository.create({
				data: { refreshToken, userId: finalUser.id },
			});

			return { refreshToken, accessToken };
		} catch (error) {
			throw error;
		}
	};

	public googleOAuthRegistration = async (code: string): Promise<TokenDto> => {
		try {
			const userRepository = this.databaseInstance.userRepository;
			const sessionRepository = this.databaseInstance.sessionRepository;

			if (!userRepository || !sessionRepository) {
				console.error("Database repositories not initialized.");
				throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred.");
			}

			const { access_token, id_token } = await this.getGoogleAuthToken(
				code,
				AppConstants.GOOGLE_OAUTH_REGISTRATION_REDIRECT_URL,
			);
			const googleUser = await this.getGoogleAuthUser(id_token, access_token);

			const existingUser = await this.databaseInstance.userRepository.findFirst({
				where: {
					AND: [{ id: googleUser.sub }, { email: googleUser.email }],
				},
			});

			if (!googleUser.verified_email) {
				console.log("Google email unverified.");
				throw new HttpException(httpStatus.FORBIDDEN, "Google account is unverified.");
			} else if (existingUser) {
				console.log("User already registered with email.");
				throw new HttpException(
					httpStatus.BAD_REQUEST,
					"User is already registered with the email.",
				);
			}

			const finalUser = await this.userService.createAndSaveUser({
				email: googleUser.email,
				username: googleUser.name,
				authProvider: AuthProvider.GOOGLE,
				id: googleUser.sub,
			});

			const accessToken = this.createAccessToken({
				username: finalUser.username,
				userId: finalUser.id,
			});

			const refreshToken = this.createRefreshToken({
				username: finalUser.username,
				userId: finalUser.id,
			});

			const newUserSession = await this.databaseInstance.sessionRepository.create({
				data: {
					refreshToken,
					userId: finalUser.id,
				},
			});

			return { accessToken, refreshToken };
		} catch (error) {
			console.log("Failed to authenticate with google.");
			throw error;
		}
	};

	public googleOAuthLogin = async (code: string): Promise<TokenDto> => {
		try {
			const userRepository = this.databaseInstance.userRepository;
			const sessionRepository = this.databaseInstance.sessionRepository;

			if (!userRepository || !sessionRepository) {
				console.error("Database repositories not initialized.");
				throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred.");
			}

			const { access_token, id_token } = await this.getGoogleAuthToken(
				code,
				AppConstants.GOOGLE_OAUTH_LOGIN_REDIRECT_URL,
			);
			const googleUser = await this.getGoogleAuthUser(id_token, access_token);

			const user = await this.databaseInstance.userRepository.findFirst({
				where: {
					AND: [{ email: googleUser.email }, { id: googleUser.sub }],
				},
			});

			if (!googleUser.verified_email) {
				console.log("Google email unverified.");
				throw new HttpException(httpStatus.FORBIDDEN, "Google account is unverified.");
			} else if (!user) {
				console.log("User not registered with email.");
				throw new HttpException(
					httpStatus.BAD_REQUEST,
					"You need to register with the account first.",
				);
			}

			const accessToken = this.createAccessToken({
				username: user.username,
				userId: user.id,
			});

			const refreshToken = this.createRefreshToken({
				username: user.username,
				userId: user.id,
			});

			const session = this.databaseInstance.sessionRepository.create({
				data: { refreshToken, userId: user.id },
			});

			return { accessToken, refreshToken };
		} catch (error: any) {
			throw error;
		}
	};

	private createAccessToken(tokenPayload: TokenPayload) {
		return jwt.sign(tokenPayload, String(process.env.ACCESS_TOKEN_SECRET), {
			expiresIn: AppConstants.JWT_ACCESS_TOKEN_DURATION,
		});
	}

	private createRefreshToken(tokenPayload: TokenPayload) {
		return jwt.sign(tokenPayload, String(process.env.REFRESH_TOKEN_SECRET), {
			expiresIn: AppConstants.JWT_REFRESH_TOKEN_DURATION,
		});
	}

	private getGoogleAuthUser = async (
		id_token: string,
		google_access_token: string,
	): Promise<GoogleOAuthUserResponse> => {
		try {
			const response = await axios.get<GoogleOAuthUserResponse>(
				`${AppConstants.GOOGLE_OAUTH_GET_USER_URL}?alt=json&access_token=${google_access_token}`,
				{
					headers: {
						Authorization: `Bearer ${id_token}`,
					},
				},
			);
			return response.data;
		} catch (error) {
			console.log("Failed to fetch Google user.");
			throw new HttpException(
				httpStatus.INTERNAL_SERVER_ERROR,
				"An unexpected error occurred.",
			);
		}
	};

	private getGoogleAuthToken = async (code: string, redirectUri: string) => {
		try {
			const response = await axios.post<GoogleOAuthTokenResponse>(
				AppConstants.GOOGLE_OAUTH_TOKEN_URL,
				qs.stringify({
					code,
					client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
					client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
					redirect_uri: redirectUri,
					grant_type: "authorization_code",
				}),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);
			return response.data;
		} catch (error) {
			console.log("Failed to fetch Google token.");
			throw new HttpException(
				httpStatus.INTERNAL_SERVER_ERROR,
				"An unexpected error occurred.",
			);
		}
	};
}

export default AuthService;
