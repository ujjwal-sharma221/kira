import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  name: string;
  assigneeId: string;
  workspaceId: string;
  dueDate: string;
  description?: string;
  position: number;
  status: TaskStatus;
};

export type PayloadStatus = {
  $id: string;
  status: TaskStatus;
  position: number;
};
