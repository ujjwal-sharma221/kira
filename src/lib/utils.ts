import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID } from "./config";

interface getMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";

  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return res;
}

export async function getMember({
  databases,
  userId,
  workspaceId,
}: getMemberProps) {
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.equal("userId", userId),
  ]);

  return members.documents[0];
}

export function snakeCaseToTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
