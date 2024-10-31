import { PencilIcon, PencilOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Task } from "@/features/tasks/types";
import { Separator } from "@/components/ui/separator";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { Textarea } from "@/components/ui/textarea";

export function TaskDescription({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({ json: { description: value }, param: { taskId: task.$id } });
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          onClick={() => {
            setEditing((prev) => !prev);
          }}
          size="sm"
          variant="secondary"
        >
          {editing ? (
            <PencilOff className="mr-2 size-4" />
          ) : (
            <PencilIcon className="mr-2 size-4" />
          )}
          {editing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <Separator className="my-4" />
      {editing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description"
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            size="sm"
            disabled={isPending}
            className="ml-auto w-fit"
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">
              No description provided
            </span>
          )}
        </div>
      )}
    </div>
  );
}
