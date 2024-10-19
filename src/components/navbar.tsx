import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "./user-buttont";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-bold text-black">Home</h1>
        <p className="font-medium text-[#31363F]">
          Monitor all your tasks and projects here
        </p>
      </div>
      <div className="flex w-full items-center justify-between lg:w-fit">
        <SidebarTrigger className="text-black" />
        <UserButton />
      </div>
    </nav>
  );
};
