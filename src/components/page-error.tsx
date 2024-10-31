import Image from "next/image";

export function ErrorPage({
  message = "Something went wrong",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src="/error.svg"
        alt="error"
        height={20}
        width={20}
        className="mb-2 size-6 text-muted-foreground"
      />
      <p className="text-sm font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}
