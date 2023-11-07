import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import Authentication from "@/models/Authentication.ts";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import APILinks from "@/constants/APILinks.ts";

export type EditorHandle = {
	save: () => Promise<OutputData>;
};

type WYSIWYGEditorProps = {
	defaultData?: any;
	editorBlockId: string;
	authentication: Authentication;
	uploadImage: (files: File) => Promise<{ success: number; file: { url: string } } | undefined>;
};

const WYSIWYGEditor = forwardRef((props: WYSIWYGEditorProps, ref) => {
	const {
		defaultData = { blocks: [] },
		editorBlockId,
		authentication,
		uploadImage,
	} = props;
	const editorRef = useRef<EditorJS>();
	const [isComponentMounted, setIsComponentMounted] = useState(false);

	const initializeEditor = useCallback(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const Embed = (await import("@editorjs/embed")).default;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const Table = (await import("@editorjs/table")).default;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const List = (await import("@editorjs/list")).default;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const Code = (await import("@editorjs/code")).default;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const LinkTool = (await import("@editorjs/link")).default;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const InlineCode = (await import("@editorjs/inline-code")).default;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const ImageTool = (await import("@editorjs/image")).default;

		if (!editorRef.current) {
			const editor = new EditorJS({
				holder: editorBlockId,
				onReady() {
					editorRef.current = editor;
				},
				placeholder: "Type here to write your post...",
				inlineToolbar: true,
				data: defaultData,
				tools: {
					header: Header,
					linkTool: {
						class: LinkTool,
						config: {
							endpoint: `${
								import.meta.env.VITE_API_BASE_URL
							}/${APILinks.unfurlLink()}`,
							headers: {
								authorization: `Bearer ${authentication.accessToken}`,
							},
						},
					},
					image: {
						class: ImageTool,
						config: {
							uploader: { uploadByFile: uploadImage },
						},
					},
					list: List,
					code: Code,
					inlineCode: InlineCode,
					table: Table,
					embed: Embed,
				},
			});
		}
	}, [authentication.accessToken, defaultData, editorBlockId, uploadImage]);

	useImperativeHandle(ref, () => ({
		save() {
			return editorRef.current?.save();
		},
	}));

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsComponentMounted(true);
		}
	}, []);

	useEffect(() => {
		const init = async () => {
			await initializeEditor();
		};

		if (isComponentMounted) {
			void init();

			return () => {
				editorRef.current?.destroy();
				editorRef.current = undefined;
			};
		}
	}, [initializeEditor, isComponentMounted]);

	return <div id={editorBlockId} className="min-h-[500px]" />;
});

const RichWYSIWYGEditor = memo(WYSIWYGEditor);

export default RichWYSIWYGEditor;
