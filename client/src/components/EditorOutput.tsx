import CustomImageRenderer from "@/components/CustomImageRenderer.tsx";
import CustomCodeRenderer from "@/components/CustomCodeRenderer.tsx";
import { Suspense } from "react";
import Output from "editorjs-react-renderer";

type EditorOutputProps = {
	postContent: any;
};

const style = {
	paragraph: {
		fontSize: "0.875rem",
		lineHeight: "1.25rem",
	},
};

const EditorOutput = (props: EditorOutputProps) => {
	const { postContent } = props;

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Output
				style={style}
				className="text-sm"
				renderers={{ image: CustomImageRenderer, code: CustomCodeRenderer }}
				data={postContent}
			/>
		</Suspense>
	);
};

export default EditorOutput;