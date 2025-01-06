import { DashboardHeader } from "@/components/header";
import { DashboardSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <SidebarProvider>
    //   <div className="flex min-h-screen">
    //     <DashboardSidebar />
    //     <SidebarInset className="flex w-full flex-col">
    //       <DashboardHeader />
    //       <main className="flex-1 p-4 sm:p-8 ">{children}</main>
    //     </SidebarInset>
    //   </div>
    // </SidebarProvider>
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
