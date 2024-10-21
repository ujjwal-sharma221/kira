import { redirect } from "next/navigation";

import { SignInCard } from "../_components/sign-in-card";
import { getCurrent } from "@/features/auth/action";

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");

  return (
    <div>
      <SignInCard />
    </div>
  );
};

export default SignInPage;
