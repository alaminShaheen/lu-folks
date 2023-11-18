import GroupInfo from "@/models/GroupInfo.ts";

type SuggestedGroupInfo = Omit<GroupInfo, "isMember">;

export default SuggestedGroupInfo;
