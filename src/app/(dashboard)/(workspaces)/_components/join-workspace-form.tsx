"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useInviteCode } from "@/hooks/use-invite-code";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export function JoinWorkspaceForm({
  intialValues: { name },
}: {
  intialValues: { name: string };
}) {
  const router = useRouter();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoinWorkspace();

  function onSubmit() {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          Join Workspace &quot;{name}&quot;
        </CardTitle>
        <CardDescription>
          You have been invited to join <strong>{name}</strong>{" "}
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="p-7">
        <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
          <Button
            disabled={isPending}
            size="lg"
            variant="secondary"
            type="button"
            className="w-full border lg:w-fit"
            asChild
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            disabled={isPending}
            size="lg"
            className="w-full lg:w-fit"
            type="button"
            onClick={onSubmit}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
