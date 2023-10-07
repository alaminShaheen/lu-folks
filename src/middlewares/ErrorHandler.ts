import HttpException from '@/exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';

function ErrorHandler(
	error: HttpException,
	__: Request,
	response: Response,
	_: NextFunction
) {
	console.log(error);
	response.status(error.status).send(error);
}

export default ErrorHandler;