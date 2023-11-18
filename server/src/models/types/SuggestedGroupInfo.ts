import GroupInfo from "@/models/types/GroupInfo";

type SuggestedGroupInfo = Omit<GroupInfo, "isMember">;

export default SuggestedGroupInfo;
