import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import APILinks from "@/constants/APILinks.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import CreateGroupForm from "@/models/form/CreateGroupForm.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import FieldValidationError from "@/models/FieldValidationError.ts";
import Group from "@/models/Group.ts";
import { AxiosError } from "axios";
import ROUTES from "@/constants/Routes.ts";

const CreateGroup = () => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = useForm<CreateGroupForm>({
		defaultValues: {
			title: "",
		},
	});
	const navigate = useNavigate();
	const groupTitle = watch("title");
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();

	const onSubmit = useCallback(
		async (formValues: CreateGroupForm) => {
			try {
				toast.dismiss();
				setIsLoading(true);
				const { data } = await axiosInstance.post<Group>(
					APILinks.createGroup(),
					formValues,
				);
				console.log(data);
				toast.success("GroupDetails created successfully!");
				navigate(`/${ROUTES.GROUP.BASE}/${data.id}`);
			} catch (error: any) {
				if (error instanceof AxiosError) {
					if (error.response?.data.type === ApiErrorType.FIELD_VALIDATION) {
						Object.entries(
							(error.response.data as FieldValidationError).validationError,
						).forEach(([key, value]) => {
							setError(key as keyof CreateGroupForm, {
								message: value,
								type: "server,
							});
						});
					} else {
						toast.error(error.response?.data.message);
					}
				} else {
					toast.error(error.response?.data.message);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[axiosInstance, setError]
	);

	return (
		<div className="container flex items-center h-full max-w-3xl mx-auto">
			<div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold">Create a Community</h1>
				</div>

				<hr className="bg-red-500 h-px" />

				<div className="">
					<form id="create-group-form" onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-1">
							<Label className="text-lg font-medium" htmlFor="title">
								Name
							</Label>
							<p className="text-xs pb-2 text-yellow-500">
								Community names including capitalization cannot be changed.
							</p>
							<Input
								{...register("title", {
									required: "Title is required",
								})}
								id="title"
								placeholder="Study"
								type="text"
								autoCapitalize="none"
								autoComplete="text"
								autoCorrect="off"
								disabled={isLoading}
							/>
							{errors.title?.message && (
								<span className="text-xs text-red-500 my-2">
									{errors.title.message}
								</span>
							)}
						</div>
					</form>
				</div>

				<div className="flex justify-end items-center gap-4">
					<Button disabled={isLoading} variant="secondary">
						<Link to="/news-feed" tabIndex={-1}>
							Cancel
						</Link>
					</Button>
					<Button
						disabled={groupTitle.length === 0 || isLoading}
						form="create-group-form"
						onSubmit={handleSubmit(onSubmit)}
					>
						Create Community
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreateGroup;
