import { LoaderCircle } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div>
        <LoaderCircle className="size-6 animate-spin" />
      </div>
    </div>
  );
}
