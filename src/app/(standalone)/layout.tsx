import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@/components/user-buttont";

const StandaloneLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex h-[73px] items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" height={40} width={40} />
          </Link>
          <UserButton />
        </nav>
        <div className="just ify-center flex flex-col items-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
