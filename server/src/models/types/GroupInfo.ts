import { Group } from "@prisma/client";

type GroupInfo =
	| Pick<Group, "id" | "title" | "updatedAt" | "createdAt" | "creatorId">
	| {
			groupMemberCount: number;
			isMember: boolean;
	  };

export default GroupInfo;
