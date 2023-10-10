import HttpException from '@/exceptions/httpException';

class FieldValidationException extends HttpException {
	constructor(
		status: number,
		message: string,
		public fieldErrors: { [key: string]: string },
	) {
		super(status, message);
	}
}

export default FieldValidationException;
