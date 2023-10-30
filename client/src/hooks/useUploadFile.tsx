import { generateReactHelpers } from "@uploadthing/react/hooks";

const UseUploadFile = () => {
	const { uploadFiles, useUploadThing } = generateReactHelpers();

	return {
		uploadFiles,
		useUploadThing,
	};
};

export default UseUploadFile;
