import { NextFunction, Request, Response } from "express";
import HttpException from "@/exceptions/httpException";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import process from "process";

function VerifyAuthentication(request: Request, response: Response, nextFunction: NextFunction) {
	const authHeader = request.headers.authorization;

	if (!authHeader)
		return nextFunction(new HttpException(httpStatus.FORBIDDEN, "User is unauthorized"));

	// authHeader = "Bearer <<token>>
	const token = authHeader.split(" ")[1];
	jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET), (error, decoded) => {
		if (error) {
			return nextFunction(new HttpException(httpStatus.FORBIDDEN, "User is unauthorized"));
		}

		const userInfo = decoded as JwtPayload;
		request.user = { username: userInfo.username, userId: userInfo.userId };
		nextFunction();
	});
}

export default VerifyAuthentication;
