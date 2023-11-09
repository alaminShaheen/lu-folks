import { useMatch, useResolvedPath } from "react-router-dom";

const UseRelativeRouteMatch = (relativePath: string) => {
	const { pathname } = useResolvedPath(relativePath, { relative: "route" });
	return useMatch({ path: pathname });
};
export default UseRelativeRouteMatch;
