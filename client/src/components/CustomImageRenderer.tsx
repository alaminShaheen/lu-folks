import React from "react";

const CustomImageRenderer = ({ data }: any) => {
	return (
		<div className="relative w-full min-h-[15rem]">
			<img alt="image" className="object-contain" src={data.file.url} />
		</div>
	);
};

export default CustomImageRenderer;
