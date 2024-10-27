import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";

import { AUTH_COOKIE } from "@/lib/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/lib/config";
import { getMember } from "@/lib/utils";
import { workspaceVals } from "./workspace-types";

export const getWorkspaces = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const sessionCookie = cookies().get(AUTH_COOKIE);
  if (!sessionCookie) return { documents: [], total: 0 };

  client.setSession(sessionCookie.value);

  const databases = new Databases(client);
  const account = new Account(client);

  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);
  if (members.total === 0) {
    return { documents: [], total: 0 };
  }

  const workspaceIds = members.documents.map((m) => m.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
    Query.contains("$id", workspaceIds),
    Query.orderDesc("$createdAt"),
  ]);

  return workspaces;
};

export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const sessionCookie = cookies().get(AUTH_COOKIE);
  if (!sessionCookie) return null;

  client.setSession(sessionCookie.value);

  const databases = new Databases(client);
  const account = new Account(client);

  const user = await account.get();

  const member = await getMember({
    userId: user.$id,
    databases,
    workspaceId,
  });
  if (!member) throw new Error("Unauthorized");

  const workspace = await databases.getDocument<workspaceVals>(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId,
  );

  return workspace;
};

export const getWorkspaceInfo = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const sessionCookie = cookies().get(AUTH_COOKIE);
  if (!sessionCookie) return null;

  client.setSession(sessionCookie.value);

  const databases = new Databases(client);

  const workspace = await databases.getDocument<workspaceVals>(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId,
  );

  return { name: workspace.name };
};
