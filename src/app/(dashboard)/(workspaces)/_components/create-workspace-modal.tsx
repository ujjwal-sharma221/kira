"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "./create-workspace.form";
import { useWorkspaceModal } from "@/hooks/use-create-workspace-modal";

export function CreateWorkspaceModal() {
  const { isOpen, setIsOpen, close } = useWorkspaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
}
