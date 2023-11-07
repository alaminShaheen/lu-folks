import { toast } from "react-toastify";
import { AxiosError } from "axios";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import FieldValidationError from "@/models/FieldValidationError.ts";

function HandleError(error: any, setError?: any) {
	if (error instanceof AxiosError) {
		if (error.response?.data.type === ApiErrorType.FIELD_VALIDATION) {
			Object.entries((error.response.data as FieldValidationError).validationErrors).forEach(
				([key, value]) => {
					setError?.(key as any, { message: value, type: "server" });
				},
			);
		} else {
			toast.dismiss();
			toast.error(error.response?.data.message);
		}
	} else {
		toast.dismiss();
		toast.error(error.message);
	}
}

export default HandleError;
