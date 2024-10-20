import Image from "next/image";

const DashboardLoading = () => {
  return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <Image
        src="/loading.svg"
        alt="loader"
        height={24}
        width={24}
        className="animate-pulse"
      />
    </div>
  );
};
export default DashboardLoading;
