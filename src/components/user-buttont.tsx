"use client";

import Image from "next/image";

import { useCurrent } from "@/app/(auth)/api/use-current";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useLogout } from "@/app/(auth)/api/use-logout";

export function UserButton() {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center">
        <Image
          src="/placeholder.svg"
          height={16}
          width={16}
          alt="placeholder"
          className="animate-spin"
        />
      </div>
    );
  }

  if (!user) return null;

  const { email, name } = user;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 border border-neutral-100 transition hover:opacity-75">
          <AvatarFallback className="flex items-center justify-center font-medium">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-semibold capitalize">{name || "User"}</p>
            <p className="text-xs text-muted-foreground">{email || "User"}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="mb-1" />

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex h-10 cursor-pointer items-center justify-center bg-zinc-800 font-medium text-white"
        >
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
