import HttpError from "@/models/HttpError.ts";

class FieldValidationError extends HttpError {
	constructor(
		status: number,
		public validationErrors: { [key: string]: string },
		message?: string,
	) {
		super(status, message || "Field validation errors.");
	}
}

export default FieldValidationError;
