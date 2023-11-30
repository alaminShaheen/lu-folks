import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import ProfileForm from "@/models/ProfileForm.ts";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext.tsx";
import useUpdateUser from "@/hooks/user/useUpdateUser.tsx";
import AuthProvider from "@/models/AuthProvider.ts";
import { useQueryClient } from "@tanstack/react-query";
import User from "@/models/User.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import useGetUser from "@/hooks/user/useGetUser.tsx";

const Profile = () => {
	const { user: currentUser } = useAppContext();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<ProfileForm>({
		defaultValues: {
			username: "",
			email: "",
		},
	});
	const params = useParams<"userId">();
	const queryClient = useQueryClient();
	const [changed, setChanged] = useState(false);

	const { mutate, isPending } = useUpdateUser({
		onSuccess: (updatedUser) => {
			queryClient.setQueryData<User>([QueryKeys.CURRENT_USER], (oldUser) => {
				if (oldUser) {
					console.log({
						...oldUser,
						...updatedUser,
					});
					return {
						...oldUser,
						...updatedUser,
					};
				}
				return oldUser;
			});
			toast.success("You profile has been updated successfully.");
			setChanged(false);
		},
	});

	const { data: user, isLoading } = useGetUser({ userId: params.userId! });

	const onSubmit = useCallback(
		(formData: ProfileForm) => {
			mutate(formData);
		},
		[mutate],
	);

	useEffect(() => {
		if (user) {
			setValue("email", user.email);
			setValue("username", user.username);
		}
	}, [setValue, user]);

	return (
		<div className="max-w-4xl mx-auto py-12">
			<div className="grid items-start gap-8">
				<h1 className="font-bold text-3xl md:text-4xl">Profile</h1>
				{isLoading ? (
					<div>Loading....</div>
				) : (
					<Fragment>
						{currentUser?.id === params.userId ? (
							<div className="grid gap-10">
								<form className="" onSubmit={handleSubmit(onSubmit)}>
									<Card>
										<CardHeader>
											<CardTitle>Your username</CardTitle>
											<CardDescription>
												Please enter a display name you are comfortable
												with.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="relative grid gap-1">
												<Label className="sr-only" htmlFor="username">
													Name
												</Label>
												<Input
													id="username"
													className="min-w-fit max-w-[400px]"
													size={32}
													{...register("username", {
														required: "Username is required",
														onChange: () => {
															setChanged(true);
														},
													})}
												/>
												{errors?.username && (
													<p className="px-1 text-xs text-red-600">
														{errors.username.message}
													</p>
												)}
											</div>
										</CardContent>
										{user?.authProvider === AuthProvider.VANILLA && (
											<Fragment>
												<CardHeader>
													<CardTitle>Your email address</CardTitle>
													<CardDescription>
														Please enter an email address that will be
														used to log in.
													</CardDescription>
												</CardHeader>

												<CardContent>
													<div className="relative grid gap-1">
														<Label className="sr-only" htmlFor="email">
															Email
														</Label>
														<Input
															id="email"
															className="min-w-fit max-w-[400px]"
															size={32}
															{...register("email", {
																required: "Email is required",
																onChange: () => {
																	setChanged(true);
																},
															})}
														/>
														{errors?.username && (
															<p className="px-1 text-xs text-red-600">
																{errors.email?.message}
															</p>
														)}
													</div>
												</CardContent>
											</Fragment>
										)}
										<CardFooter>
											<Button loading={isPending} disabled={!changed}>
												Update Profile
											</Button>
										</CardFooter>
									</Card>
								</form>
							</div>
						) : (
							<div className="grid gap-10">
								<Card>
									<CardHeader>
										<CardTitle>{user?.username}</CardTitle>
									</CardHeader>
									<CardContent>{user?.email}</CardContent>
								</Card>
							</div>
						)}
					</Fragment>
				)}
			</div>
		</div>
	);
};

export default Profile;
