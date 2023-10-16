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
		return response.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).send({
			type: ApiErrorType.FIELD_VALIDATION,
			validationErrors: error.fieldErrors,
			message: error.message,
		});
	} else {
		return response.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).send({
			type: ApiErrorType.GENERAL,
			message: error.message,
		});
	}
}

export default ErrorHandler;
