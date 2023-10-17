import HttpException from "@/exceptions/httpException";

class FieldValidationException extends HttpException {
	constructor(
		status: number,
		public fieldErrors: { [key: string]: string },
		message?: string,
	) {
		super(status, message || "Field validation errors.");
	}
}

export default FieldValidationException;
