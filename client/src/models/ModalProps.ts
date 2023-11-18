import { ReactNode } from "react";

type ModalProps = {
	open: boolean;
	toggle: () => void;
	modalTitle: string | ReactNode;
	modalDescription?: string | ReactNode;
};

export default ModalProps;
