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
import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext.tsx";

const Profile = () => {
	const { user } = useAppContext();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileForm>({
		defaultValues: {
			username: user?.username!,
		},
	});

	const onSubmit = useCallback((data: ProfileForm) => {}, []);

	return (
		<div className="max-w-4xl mx-auto py-12">
			<div className="grid items-start gap-8">
				<h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

				<div className="grid gap-10">
					<form className="" onSubmit={handleSubmit(onSubmit)}>
						<Card>
							<CardHeader>
								<CardTitle>Your username</CardTitle>
								<CardDescription>
									Please enter a display name you are comfortable with.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="relative grid gap-1">
									<Label className="sr-only" htmlFor="name">
										Name
									</Label>
									<Input
										id="name"
										className="min-w-fit max-w-[400px]"
										size={32}
										{...register("username", {
											required: "Username is required",
										})}
									/>
									{errors?.username && (
										<p className="px-1 text-xs text-red-600">
											{errors.username.message}
										</p>
									)}
								</div>
							</CardContent>
							<CardFooter>
								<Button loading={false}>Update Profile</Button>
							</CardFooter>
						</Card>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Profile;
