import HttpException from '@/exceptions/httpException';
import FieldValidationException from '@/exceptions/fieldValidationException';
import { NextFunction, Request, Response } from 'express';
import ApiErrorType from '@/models/enums/apiErrorType';

function ErrorHandler(
	error: HttpException | FieldValidationException,
	__: Request,
	response: Response,
	_: NextFunction
) {
	if (error instanceof FieldValidationException) {
		return response
			.status(error.status)
			.send({
				type: ApiErrorType.FIELD_VALIDATION,
				validationErrors: error.fieldErrors,
				message: error.message,
			});
	} else {
		return response
			.status(error.status)
			.send({
				type: ApiErrorType.FIELD_VALIDATION,
				message: error.message
			});
	}
}

export default ErrorHandler;