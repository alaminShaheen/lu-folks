import { ClassConstructor, plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validateOrReject, ValidationError } from "class-validator";
import httpStatus from "http-status";
import errorHandler from "./errorHandler";
import FieldValidationException from "@/exceptions/fieldValidationException";

function DtoValidator<T>(dtoClass: ClassConstructor<T>) {
	return async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			request.body = Object.setPrototypeOf(request.body, dtoClass.prototype);
			await validateOrReject(request.body, { stopAtFirstError: true });
			request.body = plainToInstance(dtoClass, request.body);
			nextFunction();
		} catch (errors: unknown) {
			const validationErrors = (errors as ValidationError[]).reduce(
				(errorObject, validationError) => {
					errorObject[validationError.property] = Object.values(
						validationError.constraints || {},
					)[0];
					return errorObject;
				},
				{} as Record<string, string>,
			);
			errorHandler(
				new FieldValidationException(httpStatus.BAD_REQUEST, validationErrors),
				request,
				response,
				nextFunction,
			);
		}
	};
}

export default DtoValidator;
