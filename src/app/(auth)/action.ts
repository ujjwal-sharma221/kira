import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

import { AUTH_COOKIE } from "@/lib/constants";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const sessionCookie = cookies().get(AUTH_COOKIE);
    if (!sessionCookie) return null;

    client.setSession(sessionCookie.value);

    const account = new Account(client);

    return await account.get();
  } catch (error) {
    console.error(error);
    return null;
  }
};
