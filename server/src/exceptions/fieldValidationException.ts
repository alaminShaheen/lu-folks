import HttpException from "@/exceptions/httpException";

class FieldValidationException extends HttpException {
	constructor(
		status: number,
		public validationErrors: { [key: string]: string },
		message?: string,
	) {
		super(status, message || "Field validation errors.");
	}
}

export default FieldValidationException;
