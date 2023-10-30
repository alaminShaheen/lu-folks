import Group from "@/models/Group.ts";

type GroupInfo = Pick<Group, "id" | "title" | "updatedAt" | "createdAt">;

export default GroupInfo;
