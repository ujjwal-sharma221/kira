import { Models } from "node-appwrite";

export type projectValues = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};
