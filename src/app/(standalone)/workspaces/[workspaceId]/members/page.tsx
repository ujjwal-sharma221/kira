import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { MembersList } from "./_components/members-list";

const WorkspaceIdMembersPage = async () => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
