import { redirect } from "next/navigation";

import { UserButton } from "@/components/user-buttont";
import { getCurrent } from "./(auth)/action";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div>
      <UserButton />
    </div>
  );
}
