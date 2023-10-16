import bcrypt from "bcrypt";
import process from "process";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
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

	refreshToken = async (
		cookies: Record<string, string>,
		userId: number,
	): Promise<Omit<TokenDto, "refreshToken">> => {
		const refreshToken = cookies.jwt;

		if (!refreshToken) {
			throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthenticated.");
		}

		try {
			const user = await this.databaseInstance.userRepository?.findOne({
				where: { id: userId },
				relations: {
					session: true,
				},
			});

			if (!user || !user.session) {
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthenticated");
			}

			const jwtPayload = jwt.verify(
				refreshToken,
				String(process.env.REFRESH_TOKEN_SECRET),
			) as JwtPayload;
			const userInfo = jwtPayload["user"] as TokenPayload;
			if (!userInfo || userInfo.userId !== user.id || userInfo.username !== user.username) {
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthorized.");
			}

			const accessToken = this.createToken(
				{ username: userInfo.username, userId: userInfo.userId },
				String(process.env.ACCESS_TOKEN_SECRET),
				60 * 3,
			);

			return { accessToken };
		} catch (error) {
			if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthorized.");
			} else {
				throw error;
			}
		}
	};

	createToken(tokenPayload: TokenPayload, secret: string, expiresIn: string | number) {
		return jwt.sign(tokenPayload, secret, { expiresIn: expiresIn });
	}

	login = async (userInfo: LoginUserDto): Promise<TokenDto> => {
		const { username, password } = userInfo;

		try {
			const userRepository = this.databaseInstance.userRepository;
			const sessionRepository = this.databaseInstance.sessionRepository;

			if (!userRepository || !sessionRepository) {
				throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred.");
			}

			const user = await userRepository.findOneBy({ username });

			if (!user) {
				throw new HttpException(httpStatus.BAD_REQUEST, "Incorrect login credentials");
			}

			const correctPassword = await bcrypt.compare(password, user.password);

			if (!correctPassword) {
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

			return { accessToken, refreshToken };
		} catch (error) {
			throw error;
		}
	};

	logout = async (userId: number) => {
		try {
			const user = await this.databaseInstance.userRepository?.findOne({
				relations: { session: true },
				where: { id: userId },
			});

			if (!user || !user.session) {
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is unauthenticated");
			}
			await this.databaseInstance.sessionRepository?.remove(user.session);
		} catch (error) {
			throw error;
		}
	};

	register = async (userInfo: RegisterUserDto): Promise<TokenDto> => {
		const { confirmPassword, email, password, username } = userInfo;

		if (password !== confirmPassword)
			throw new FieldValidationException(httpStatus.BAD_REQUEST, {
				confirmPassword: "Passwords do not match.",
			});

		try {
			const userRepository = this.databaseInstance.userRepository;
			const sessionRepository = this.databaseInstance.sessionRepository;

			if (!userRepository || !sessionRepository)
				throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred.");

			const userWithSameEntries = await userRepository.find({
				where: [{ username }, { email }],
			});

			if (userWithSameEntries && userWithSameEntries.length > 0) {
				if (userWithSameEntries[0].email === email)
					throw new FieldValidationException(httpStatus.BAD_REQUEST, {
						email: "Email already in use.",
					});
				else
					throw new FieldValidationException(httpStatus.BAD_REQUEST, {
						username: "Username already in user.",
					});
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
}

export default AuthService;
