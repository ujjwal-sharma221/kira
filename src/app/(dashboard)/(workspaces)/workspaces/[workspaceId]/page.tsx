import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";

const WorkspacePage = async () => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");

  return <div>Workspace Id Page</div>;
};

export default WorkspacePage;
