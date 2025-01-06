"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Users2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Meetings", href: "/dashboard/meetings", icon: CalendarCheck },
    ],
  },
  {
    title: "Organization",
    items: [
      { title: "Offices", href: "/dashboard/offices", icon: Building2 },
      { title: "Departments", href: "/dashboard/departments", icon: Users2 },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Check In Officer", href: "/dashboard/check-in", icon: Users },
      { title: "Tajneed", href: "/dashboard/tajneed", icon: Users },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

interface NavGroupProps {
  group: {
    title: string;
    items: {
      title: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
    }[];
  };
  pathname: string;
}

function NavGroup({ group, pathname }: NavGroupProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/50">
        <span className="text-sm font-medium">{group.title}</span>
        <ChevronDown
          className={`size-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {group.items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.title}
            >
              <Link href={item.href}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary" />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">Organization Name</h2>
            <p className="text-xs text-muted-foreground">Attendance System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 px-6">
        <SidebarMenu>
          {navigation.map((group) => (
            <NavGroup key={group.title} group={group} pathname={pathname} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
