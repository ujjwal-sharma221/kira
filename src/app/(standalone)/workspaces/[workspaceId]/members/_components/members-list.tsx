"use client";

import { MoveLeft, RectangleEllipsis } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "./member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";

export function MembersList() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: deletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: updatingMember } = useUpdateMember();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive",
  );

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
        <Button className="" variant="link" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <MoveLeft className="size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((m, i) => (
          <Fragment key={m.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={m.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {m.email}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="link" size="icon">
                    <RectangleEllipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="text-zinc-700"
                  side="bottom"
                  align="end"
                >
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(m.$id, MemberRole.ADMIN)}
                    disabled={updatingMember}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(m.$id, MemberRole.MEMBER)}
                    disabled={updatingMember}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-destructive"
                    onClick={() => handleDeleteMember(m.$id)}
                    disabled={deletingMember}
                  >
                    Remove {m.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {i < data.documents.length - 1 && (
              <div className="my-2.5 border-[0.2px] border-zinc-500" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
