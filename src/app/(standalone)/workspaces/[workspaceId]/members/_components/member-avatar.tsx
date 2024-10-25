import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export function MemberAvatar({
  fallbackClassName,
  name,
  className,
}: MemberAvatarProps) {
  return (
    <Avatar
      className={cn(
        "size-5 rounded-full border border-neutral-300 transition",
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "flex items-center justify-center font-medium",
          fallbackClassName,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
