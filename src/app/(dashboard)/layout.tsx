import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateWorkspaceModal } from "./(workspaces)/_components/create-workspace-modal";
import { CreateProjectModal } from "./(projects)/_components/create-project-modal";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <div className="flex size-full">
        <div className="w-full">
          <SidebarProvider>
            <AppSidebar />
            <main className="flex h-full w-full flex-col">
              <Navbar />
              <div className="w-full px-4 py-6">{children}</div>
            </main>
          </SidebarProvider>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
