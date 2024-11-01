import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { ProjectIdSettings } from "./client";

const ProjectSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectIdSettings />;
};

export default ProjectSettingsPage;
