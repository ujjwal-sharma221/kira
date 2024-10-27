import { Account, Client, Databases } from "node-appwrite";
import { cookies } from "next/headers";

import { AUTH_COOKIE } from "@/lib/constants";
import { getMember } from "@/lib/utils";
import { DATABASE_ID, PROJECTS_ID } from "@/lib/config";
import { projectValues } from "./project-types";

export const getProject = async ({ projectId }: { projectId: string }) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const sessionCookie = cookies().get(AUTH_COOKIE);
  if (!sessionCookie) return null;

  client.setSession(sessionCookie.value);

  const databases = new Databases(client);
  const account = new Account(client);

  const user = await account.get();

  const project = await databases.getDocument<projectValues>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId,
  );

  const member = await getMember({
    userId: user.$id,
    databases,
    workspaceId: project.workspaceId,
  });
  if (!member) throw new Error("Unauthorized");

  return project;
};
