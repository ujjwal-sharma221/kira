import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { TaskViewSwitcher } from "@/components/task-view-switcher";

const TaskPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TaskPage;
