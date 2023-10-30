import { Group } from "@prisma/client";

type GroupInfo = Pick<Group, "id" | "title" | "updatedAt" | "createdAt" | "creatorId">;

export default GroupInfo;
