"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import Image from "next/image";
import { ImageIcon, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateProject } from "@/features/projects/api/use-update-project";
import {
  updateProjectSchema,
  UpdateProjectValues,
} from "@/lib/schemas/project-schema";
import { projectValues } from "@/features/projects/project-types";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: projectValues;
}

export const EditProjectForm = ({
  onCancel,
  initialValues: initialValues,
}: EditProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const inputRef = useRef<HTMLInputElement>(null);

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action is irrevisible",
    "destructive",
  );
  const { mutate: deleteProject, isPending: deletingProject } =
    useDeleteProject();

  const form = useForm<UpdateProjectValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  function onSubmit(values: UpdateProjectValues) {
    const finalVals = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalVals, param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  }

  async function handleDelete() {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteProject(
      {
        param: { projectId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="h-full w-full border-none text-[#222222] shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size="sm"
            className="border hover:bg-neutral-200"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`,
                    )
            }
          >
            <MoveLeft />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          className=""
                          placeholder="Enter project name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px]" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPEG, PNG, SVG or JPG (max 1MB)
                          </p>
                          <input
                            disabled={isPending}
                            onChange={handleImageChange}
                            hidden
                            accept=".jpg, .png, .jpeg, .svg"
                            type="file"
                            ref={inputRef}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="w-fit"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              disabled={isPending}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              className="mt-2 w-fit border bg-[#9ca6d6] text-[#152b33] hover:bg-neutral-300"
                              onClick={() => inputRef.current?.click()}
                              disabled={isPending}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <Separator className="my-7" />
              <div className="flex items-center gap-4">
                <Button
                  disabled={isPending}
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  className={cn(
                    onCancel
                      ? "border border-black bg-transparent hover:bg-neutral-200"
                      : "hidden",
                  )}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className=""
                  disabled={isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this workspace is irreversible and will delete all the
              associated data
            </p>
            <Button
              disabled={isPending || deletingProject}
              onClick={handleDelete}
              type="button"
              variant="destructive"
              className="ml-auto mt-6 w-fit"
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
