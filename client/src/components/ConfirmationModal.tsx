import { ReactNode } from "react";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";

type ConfirmationModalProps = {
	title: string | ReactNode;
	description?: string | ReactNode;
	actionButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	actonButtonText?: string | ReactNode;
	onAction: () => void;
};

const ConfirmationModal = (props: ConfirmationModalProps) => {
	const { title, description, actionButtonVariant, actonButtonText, onAction } = props;
	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{title}</AlertDialogTitle>
				{description && <AlertDialogDescription>{description}</AlertDialogDescription>}
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel
					className={cn(
						buttonVariants({ size: "default", variant: "ghost" }),
						"border-0",
					)}
				>
					Cancel
				</AlertDialogCancel>
				<AlertDialogAction
					className={cn(
						buttonVariants({
							size: "default",
							variant: actionButtonVariant ?? "ghost",
						}),
					)}
					onClick={onAction}
				>
					{actonButtonText ?? "Confirm"}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
};

export default ConfirmationModal;
