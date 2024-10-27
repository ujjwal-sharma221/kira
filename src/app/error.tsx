"use client";

import Link from "next/link";
import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-2">
      <Construction />
      <p className="text-muted-foreground">Something went wrong</p>
      <Button variant="link" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
