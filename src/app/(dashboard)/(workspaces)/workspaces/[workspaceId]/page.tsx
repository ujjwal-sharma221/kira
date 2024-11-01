import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { WorkspaceIdClient } from "./workspace-id-client";

const WorkspacePage = async () => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdClient />;
};

export default WorkspacePage;
