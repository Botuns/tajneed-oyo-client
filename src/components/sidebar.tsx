"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Building2,
  CalendarCheck,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Users,
  Users2,
  type LucideProps,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Meetings", href: "/dashboard/meetings", icon: CalendarCheck },
    ],
  },
  {
    label: "Organization",
    items: [
      { title: "Offices", href: "/dashboard/offices", icon: Building2 },
      { title: "Officers", href: "/dashboard/departments", icon: Users2 },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Check In Officer", href: "/dashboard/check-in", icon: Users },
      { title: "Tajneed", href: "/dashboard/tajneed", icon: Users },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

const footerItems = [
  { title: "Get Help", href: "/help", icon: HelpCircle },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface NavItemProps {
  item: {
    title: string;
    href: string;
    icon: React.ComponentType<LucideProps>;
  };
  isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <item.icon className="size-[18px]" strokeWidth={1.5} />
      <span>{item.title}</span>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Organization Name
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Attendance System
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-9 bg-muted pl-9 text-sm"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <SidebarMenu className="space-y-6">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <NavItem item={item} isActive={pathname === item.href} />
                  </SidebarMenuItem>
                ))}
              </div>
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Others
        </div>
        <div className="space-y-1">
          {footerItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-[18px]" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
