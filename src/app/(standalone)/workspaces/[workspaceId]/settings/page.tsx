import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { WorkspaceSettingsClient } from "./workspace-settings-client";

const WorkspaceIdSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceSettingsClient />;
};

export default WorkspaceIdSettingsPage;
