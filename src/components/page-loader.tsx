import Image from "next/image";

export function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Image
        src="/placeholder.svg"
        alt="loader"
        className="size-6 animate-pulse"
        height={20}
        width={20}
      />
    </div>
  );
}
