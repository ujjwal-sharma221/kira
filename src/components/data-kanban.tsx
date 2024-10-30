import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";

import { PayloadStatus, Task, TaskStatus } from "@/features/tasks/types";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

interface DataKanbanProps {
  data: Task[];
  onChange: (task: PayloadStatus[]) => void;
}

type TaskState = {
  [key in TaskStatus]: Task[];
};

const boards: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.BACKLOG,
  TaskStatus.DONE,
];

export function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position,
      );
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TaskState = {
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (res: DropResult) => {
      if (!res.destination) return;

      const { source, destination } = res;

      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatePayload: PayloadStatus[] = [];

      setTasks((prevTask) => {
        const newTask = { ...prevTask };

        // Remove the task from the source column
        const sourceCol = [...newTask[sourceStatus]];
        const [movedTask] = sourceCol.splice(source.index, 1); // Destructure to get the task directly

        if (!movedTask) {
          console.error("No moved task");
          return prevTask;
        }

        // Create a new task with updated status if moving to a different column
        const updatedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        newTask[sourceStatus] = sourceCol;

        // Insert the updated task in the destination column
        const destCol = [...newTask[destinationStatus]];
        destCol.splice(destination.index, 0, updatedTask);
        newTask[destinationStatus] = destCol;

        updatePayload = [];
        // Prepare update payload for saving
        updatePayload.push({
          $id: updatedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 100_000),
        });

        newTask[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 100_000);
            if (task.position !== newPosition) {
              updatePayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destinationStatus) {
          newTask[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 100_000);
              if (task.position !== newPosition) {
                updatePayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTask;
      });

      onChange(updatePayload);
    },
    [onChange],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="mx-2 min-w-[200px] flex-1 rounded-md p-1.5"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
