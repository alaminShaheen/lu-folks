import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { UseFormSetError } from "react-hook-form";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import FieldValidationError from "@/models/FieldValidationError.ts";

function HandleError<T>(error: any, setError?: UseFormSetError<T>) {
	if (error instanceof AxiosError) {
		if (error.response?.data.type === ApiErrorType.FIELD_VALIDATION) {
			Object.entries((error.response.data as FieldValidationError).validationErrors).forEach(
				([key, value]) => {
					setError(key as keyof T, { message: value, type: "server" });
				},
			);
		} else {
			toast.dismiss();
			toast.error(error.response.data.message);
		}
	} else {
		toast.dismiss();
		toast.error(error.message);
	}
}

export default HandleError;
