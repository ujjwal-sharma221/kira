import { Models } from "node-appwrite";

export type workspaceVals = Models.Document & {
  name: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
};
