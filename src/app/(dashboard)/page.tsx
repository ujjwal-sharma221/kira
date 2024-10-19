import { redirect } from "next/navigation";

import { getCurrent } from "../(auth)/action";
import { CreateWorkspaceForm } from "../(workspaces)/_components/create-workspace.form";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <CreateWorkspaceForm />
    </div>
  );
}
