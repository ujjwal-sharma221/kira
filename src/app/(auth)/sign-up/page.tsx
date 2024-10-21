import { redirect } from "next/navigation";

import { SignUpCard } from "../_components/sign-up-card";
import { getCurrent } from "@/features/auth/action";

const SignUpPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");

  return (
    <div>
      <SignUpCard />
    </div>
  );
};

export default SignUpPage;
