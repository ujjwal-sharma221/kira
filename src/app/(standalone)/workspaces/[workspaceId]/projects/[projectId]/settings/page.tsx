import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { getProject } from "@/features/projects/actions";
import { EditProjectForm } from "@/app/(dashboard)/(projects)/_components/edit-project-form";

const ProjectSettingsPage = async ({
  params,
}: {
  params: { projectId: string };
}) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({ projectId: params.projectId });
  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectSettingsPage;
