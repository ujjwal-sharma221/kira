import { redirect } from "next/navigation";

import { getCurrent } from "../(auth)/action";
import { getWorkspaces } from "./(workspaces)/actions";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`workspaces/${workspaces.documents[0].$id}`);
  }
}
