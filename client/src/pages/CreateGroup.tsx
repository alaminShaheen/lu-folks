import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import ExtendedGroup from "@/models/ExtendedGroup.ts";
import useCreateGroup from "@/hooks/group/useCreateGroup.tsx";
import CreateGroupForm from "@/models/form/CreateGroupForm.ts";

const CreateGroup = () => {
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

	const onGroupCreated = useCallback(
		(data: ExtendedGroup) => {
			toast.success("Group created successfully!");
			navigate(`/group/${data.id}`);
		},
		[navigate],
	);

	const { mutate: createGroup, isPending } = useCreateGroup({
		setError: setError,
		onSuccess: onGroupCreated,
	});

	const onSubmit = useCallback(
		(formValues: CreateGroupForm) => {
			createGroup(formValues);
		},
		[createGrou],
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
								disabled={isPending}
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
					<Button disabled={isPending} variant="secondary">
						<Link to="/news-feed" tabIndex={-1}>
							Cancel
						</Link>
					</Button>
					<Button
						disabled={groupTitle.length === 0 || isPending}
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
