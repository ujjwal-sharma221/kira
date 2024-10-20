import Image from "next/image";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export function WorkspaceAvatar({
  image,
  name,
  className,
}: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div
        className={cn("relative size-10 overflow-hidden rounded-md", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="rounded-md bg-[#ea5c32] text-lg font-semibold uppercase text-white">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
