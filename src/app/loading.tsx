"use client";

import Image from "next/image";

const LoadingPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-2">
      <Image
        src="/loading.svg"
        height={30}
        width={30}
        alt="loading"
        className="animate-pulse"
      />
      <p className="text-muted-foreground">Loading</p>
    </div>
  );
};

export default LoadingPage;
