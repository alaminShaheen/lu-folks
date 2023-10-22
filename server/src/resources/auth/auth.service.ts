import bcrypt from "bcrypt";
import process from "process";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import TokenDto from "@/dtos/token.dto";
import IAuthService from "@/models/IAuthService";
import TokenPayload from "@/models/types/tokenPayload";
import LoginUserDto from "@/dtos/loginUser.dto";
import HttpException from "@/exceptions/httpException";
import RegisterUserDto from "@/dtos/registerUser.dto";
import PostgresDatabase from "@/database/postgres.database";
import FieldValidationException from "@/exceptions/fieldValidationException";

@injectable()
class AuthService implements IAuthService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

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
			const session = await this.databaseInstance.sessionRepository?.findOne({
				where: { refreshToken },
				relations: { user: true },
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

			const accessToken = this.createToken(
				{ username: decodedUserInfo.username, userId: decodedUserInfo.userId },
				String(process.env.ACCESS_TOKEN_SECRET),
				60 * 3,
			);

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
		const { username, password } = userInfo;

		try {
			const userRepository = this.databaseInstance.userRepository;
			const sessionRepository = this.databaseInstance.sessionRepository;

			if (!userRepository || !sessionRepository) {
				console.error("Database repositories not initialized.");
				throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred.");
			}

			const user = await userRepository.findOneBy({ username });

			if (!user) {
				console.error("Incorrect credentials provided.");
				throw new HttpException(httpStatus.BAD_REQUEST, "Incorrect login credentials");
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);

			if (!isCorrectPassword) {
				console.error("Password did not match.");
				throw new HttpException(httpStatus.BAD_REQUEST, "Incorrect login credentials");
			}

			const accessToken = this.createToken(
				{ username, userId: user.id },
				String(process.env.ACCESS_TOKEN_SECRET),
				60,
			);

			const refreshToken = this.createToken(
				{ username, userId: user.id },
				String(process.env.REFRESH_TOKEN_SECRET),
				"1d",
			);

			const session = sessionRepository.create({
				refreshToken,
			});

			await sessionRepository.save(session);

			user.session = session;

			await userRepository.save(user);

			return { accessToken, refreshToken };
		} catch (error) {
			throw error;
		}
	};

	public logout = async (userId: number) => {
		try {
			const user = await this.databaseInstance.userRepository?.findOne({
				relations: { session: true },
				where: { id: userId },
			});

			if (!user || !user.session) {
				console.error(`User is unauthenticated as no user with ${userId} found.`);
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthenticated");
			}
			await this.databaseInstance.sessionRepository?.remove(user.session);
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
			const userRepository = this.databaseInstance.userRepository;
			const sessionRepository = this.databaseInstance.sessionRepository;

			if (!userRepository || !sessionRepository) {
				console.error("Database repositories not initialized.");
				throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred.");
			}

			const userWithSameEntries = await userRepository.find({
				where: [{ username }, { email }],
			});

			if (userWithSameEntries && userWithSameEntries.length > 0) {
				if (userWithSameEntries[0].email === email) {
					console.error("Email already in use.");
					throw new FieldValidationException(httpStatus.BAD_REQUEST, {
						email: "User with email already exists.",
					});
				} else {
					console.error("Username already in user.");
					throw new FieldValidationException(httpStatus.BAD_REQUEST, {
						username: "Username already in user.",
					});
				}
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = userRepository.create({
				email,
				password: hashedPassword,
				username,
			});

			const finalUser = await userRepository.save(newUser);

			const accessToken = this.createToken(
				{ username, userId: finalUser.id },
				String(process.env.ACCESS_TOKEN_SECRET),
				60 * 3,
			);

			const refreshToken = this.createToken(
				{ username, userId: finalUser.id },
				String(process.env.REFRESH_TOKEN_SECRET),
				"1d",
			);

			const newUserSession = sessionRepository.create({
				refreshToken,
			});

			finalUser.session = await sessionRepository.save(newUserSession);

			await userRepository.save(finalUser);

			return { refreshToken, accessToken };
		} catch (error) {
			throw error;
		}
	};

	private createToken(tokenPayload: TokenPayload, secret: string, expiresIn: string | number) {
		return jwt.sign(tokenPayload, secret, { expiresIn: expiresIn });
	}
}

export default AuthService;
