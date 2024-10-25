import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import { JoinWorkspaceForm } from "@/app/(dashboard)/(workspaces)/_components/join-workspace-form";

const WorkspaceJoinPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const intialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });
  if (!intialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm intialValues={intialValues} />
    </div>
  );
};

export default WorkspaceJoinPage;
