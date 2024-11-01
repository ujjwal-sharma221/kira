"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "./user-buttont";

const pathNameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Projects",
    description: "View all of your tasks from projects here",
  },
};

const defaultPath = {
  title: "Home",
  description: "Monitor all your tasks and projects here",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathNameMap;

  const { description, title } = pathNameMap[pathnameKey] || defaultPath;

  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-bold text-black">{title}</h1>
        <p className="font-medium text-[#31363F]">{description}</p>
      </div>
      <div className="flex w-full items-center justify-between lg:w-fit">
        <SidebarTrigger className="text-black" />
        <UserButton />
      </div>
    </nav>
  );
};
