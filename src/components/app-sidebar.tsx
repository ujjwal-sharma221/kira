import { Home, ListTodo, Settings, UsersRoundIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My tasks",
    url: "/tasks",
    icon: ListTodo,
  },

  {
    title: "Members",
    url: "#",
    icon: UsersRoundIcon,
  },

  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="items-center-center flex gap-2">
          <Image src="/logo.svg" alt="logo" height={40} width={40} />
          <div className="mt-1 text-3xl font-semibold">Kira</div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarMenu className="bg-white">
        <SidebarMenuItem>
          <WorkspaceSwitcher />
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarSeparator />
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#B9C7D4] text-xs font-semibold text-black">
        (Command / Control) + B
      </SidebarFooter>
    </Sidebar>
  );
}
