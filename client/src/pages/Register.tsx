import { Fragment, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import axios from "@/api/Axios.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import InputWithIcon from "@/components/ui/InputWithIcon.tsx";
import Authentication from "@/models/Authentication.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import { AUTH_ROUTES } from "@/constants/ApiRoutes";
import RegisterFormType from "@/models/form/RegisterFormType.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import FieldValidationError from "@/models/FieldValidationError.ts";

const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setError,
	} = useForm<RegisterFormType>({
		defaultValues: {
			email: "",
			confirmPassword: "",
			password: "",
			username: "",
		},
	});
	const { setAuthentication } = useAppContext();
	const navigate = useNavigate();

	const onSubmit = async (formValues: RegisterFormType) => {
		try {
			setIsLoading(true);
			const { data } = await axios.post<Authentication>(AUTH_ROUTES.REGISTER, formValues);
			setAuthentication(data);
			toast.success("You have signed up successfully!");
			navigate("../news-feed", { relative: "route" });
		} catch (error: any) {
			if (error instanceof FieldValidationError) {
				Object.entries(error.validationErrors).forEach(([key, value]) => {
					setError(key as keyof RegisterFormType, { message: value, type: "server" });
				});
			} else {
				toast.error(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const toggleConfirmPasswordVisibility = useCallback(() => {
		setShowConfirmPassword((prev) => !prev);
	}, []);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return (
		<Fragment>
			<div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					<div className="absolute inset-0 bg-zinc-900" />
					<div className="relative z-20 flex items-center text-lg font-medium">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-2 h-6 w-6"
						>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
						</svg>
						LU Folks
					</div>
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">&ldquo;Generic quote about LU&rdquo;</p>
							<footer className="text-sm">Generic Person</footer>
						</blockquote>
					</div>
				</div>
				<div className="lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">
								Create an account
							</h1>
							<p className="text-sm text-muted-foreground">
								Enter your email below to create your account
							</p>
						</div>
						<div className="grid gap-6">
							<form id="register-form" onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-3">
									<div className="grid gap-1">
										<Label htmlFor="email">Email</Label>
										<Input
											{...register("email", {
												required: "Email is required",
											})}
											id="email"
											placeholder="name@example.com"
											type="email"
											autoCapitalize="none"
											autoComplete="email"
											autoCorrect="off"
											disabled={isLoading}
										/>
										{errors.email?.message && (
											<span className="text-xs text-red-500 my-2">
												{errors.email.message}
											</span>
										)}
									</div>

									<div className="grid gap-1">
										<Label htmlFor="username">Username</Label>
										<Input
											{...register("username", {
												required: "Username is required",
											})}
											id="username"
											placeholder="Bruce Wayne"
											type="text"
											autoCapitalize="none"
											autoCorrect="off"
											disabled={isLoading}
										/>
										{errors.username?.message && (
											<span className="text-xs text-red-500 my-2">
												{errors.username.message}
											</span>
										)}
									</div>

									<div className="grid gap-1">
										<Label htmlFor="password">Password</Label>
										<InputWithIcon
											{...register("password", {
												required: "Password is required",
											})}
											id="password"
											type={showPassword ? "text" : "password"}
											autoCapitalize="none"
											autoComplete="email"
											autoCorrect="off"
											disabled={isLoading}
											icon={
												showPassword ? (
													<EyeOff
														className="h-4 w-4"
														onClick={togglePasswordVisibility}
													/>
												) : (
													<Eye
														className="h-4 w-4"
														onClick={togglePasswordVisibility}
													/>
												)
											}
										/>
										{errors.password?.message && (
											<span className="text-xs text-red-500 my-2">
												{errors.password.message}
											</span>
										)}
									</div>

									<div className="grid gap-1">
										<Label htmlFor="confirmPassword">Confirm Password</Label>
										<InputWithIcon
											{...register("confirmPassword", {
												required: "Confirm password is required",
												validate: (value) =>
													value === watch("password") ||
													"Passwords don't match",
											})}
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											autoCapitalize="none"
											autoComplete="email"
											autoCorrect="off"
											disabled={isLoading}
											icon={
												showPassword ? (
													<EyeOff
														className="h-4 w-4"
														onClick={toggleConfirmPasswordVisibility}
													/>
												) : (
													<Eye
														className="h-4 w-4"
														onClick={toggleConfirmPasswordVisibility}
													/>
												)
											}
										/>
										{errors.confirmPassword?.message && (
											<span className="text-xs text-red-500 my-2">
												{errors.confirmPassword.message}
											</span>
										)}
									</div>

									<Button disabled={isLoading} form="register-form">
										{isLoading && <LoadingSpinner />}
										Register
									</Button>
								</div>
							</form>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<Button variant="outline" type="button" disabled={isLoading}>
								{isLoading ? (
									<LoadingSpinner />
								) : (
									<FcGoogle className="mr-2 h-4 w-4" />
								)}{" "}
								Google
							</Button>
						</div>
						<p className="px-8 text-center text-sm text-muted-foreground">
							{/*By clicking continue, you agree to our{" "}*/}
							{/*<span className="underline underline-offset-4 hover:text-primary">*/}
							{/*	Terms of Service*/}
							{/*</span>{" "}*/}
							{/*and{" "}*/}
							{/*<span className="underline underline-offset-4 hover:text-primary">*/}
							{/*	Privacy Policy*/}
							{/*</span>*/}
							{/*.*/}
							Already have an account?{" "}
							<Link
								to="/login"
								className="underline underline-offset-4 hover:text-primary"
							>
								Sign in!
							</Link>
						</p>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Register;
