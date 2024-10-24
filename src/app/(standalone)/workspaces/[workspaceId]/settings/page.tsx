import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/app/(dashboard)/(workspaces)/_components/edit-workspace-form";

const WorkspaceIdSettingsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });
  if (!initialValues) redirect(`workspaces/${params.workspaceId}`);

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
