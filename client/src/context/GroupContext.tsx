import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import Group from "@/models/Group.ts";

type GroupContextType = {
	group: Group;
	setGroup: Dispatch<SetStateAction<Group>>;
	groupMemberCount: number;
	setGroupMemberCount: Dispatch<SetStateAction<number>>;
	isMember: boolean;
	setIsMember: Dispatch<SetStateAction<boolean>>;
};

const GROUP_CONTEXT_DEFAULT_VALUES: GroupContextType = {
	group: Group.EMPTY,
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
	const [group, setGroup] = useState<Group>(GROUP_CONTEXT_DEFAULT_VALUES.group);
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
