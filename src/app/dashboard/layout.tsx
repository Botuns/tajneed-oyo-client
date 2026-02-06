"use client";

import { DashboardHeader } from "@/components/header";
import { DashboardSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRequireAuth } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useRequireAuth();

  // Don't render dashboard until authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
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
