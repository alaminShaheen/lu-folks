import HttpException from "@/exceptions/httpException";
import FieldValidationException from "@/exceptions/fieldValidationException";
import { NextFunction, Request, Response } from "express";
import ApiErrorType from "@/models/enums/apiErrorType";
import httpStatus from "http-status";

function ErrorHandler(
	error: HttpException | FieldValidationException,
	__: Request,
	response: Response,
	_: NextFunction,
) {
	if (error instanceof FieldValidationException) {
		console.log(error);
		return response.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).send({
			type: ApiErrorType.FIELD_VALIDATION,
			validationErrors: error.validationErrors,
			message: error.message,
		});
	} else if (error instanceof HttpException) {
		return response.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).send({
			type: ApiErrorType.GENERAL,
			message: error.message,
		});
	} else {
		console.log(error);
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).send({
			type: ApiErrorType.GENERAL,
			message: "An unexpected error occurred",
		});
	}
}

export default ErrorHandler;
