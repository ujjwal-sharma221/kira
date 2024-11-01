import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { MemberJoinClient } from "./join-client";

const WorkspaceJoinPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <MemberJoinClient />;
};

export default WorkspaceJoinPage;
