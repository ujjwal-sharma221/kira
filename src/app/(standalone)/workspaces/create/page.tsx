import { redirect } from "next/navigation";

import { CreateWorkspaceForm } from "@/app/(dashboard)/(workspaces)/_components/create-workspace.form";
import { getCurrent } from "@/features/auth/action";

const CreateWorkspacePage = async () => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default CreateWorkspacePage;
