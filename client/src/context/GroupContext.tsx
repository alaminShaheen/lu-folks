import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import ExtendedGroup from "@/models/ExtendedGroup.ts";

type GroupContextType = {
	group: ExtendedGroup;
	setGroup: Dispatch<SetStateAction<ExtendedGroup>>;
	groupMemberCount: number;
	setGroupMemberCount: Dispatch<SetStateAction<number>>;
	isMember: boolean;
	setIsMember: Dispatch<SetStateAction<boolean>>;
};

const GROUP_CONTEXT_DEFAULT_VALUES: GroupContextType = {
	group: ExtendedGroup.EMPTY,
	setGroup: () => {},
	setIsMember: () => {},
	setGroupMemberCount: () => {},
	groupMemberCount: 0,
	isMember: false,
};

type GroupContextProviderProps = {
	children: ReactNode;
};

export const GroupContext = createContext<GroupContextType>(GROUP_CONTEXT_DEFAULT_VALUES);

export const GroupContextProvider = (props: GroupContextProviderProps) => {
	const { children } = props;
	const [group, setGroup] = useState<ExtendedGroup>(GROUP_CONTEXT_DEFAULT_VALUES.group);
	const [groupMemberCount, setGroupMemberCount] = useState<number>(0);
	const [isMember, setIsMember] = useState(false);

	return (
		<GroupContext.Provider
			value={{
				group,
				isMember,
				groupMemberCount,
				setGroup,
				setIsMember,
				setGroupMemberCount,
			}}
		>
			{children}
		</GroupContext.Provider>
	);
};

export const useGroupContext = () => {
	return useContext(GroupContext);
};
