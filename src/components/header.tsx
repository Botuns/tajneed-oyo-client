"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Calendar, ChevronDown, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function useBreadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { label, href };
  });

  return breadcrumbs;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function DashboardHeader() {
  const breadcrumbs = useBreadcrumbs();
  const today = formatDate(new Date());

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      {/* Left Section: Sidebar trigger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />

        {/* Breadcrumbs */}
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          {breadcrumbs.slice(1).map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              {index === breadcrumbs.length - 2 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center Section: Search */}
      <div className="hidden max-w-md flex-1 px-8 lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-9 bg-muted pl-9 text-sm"
          />
        </div>
      </div>

      {/* Right Section: Date, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground md:flex">
          <Calendar className="size-4" />
          <span>{today}</span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" strokeWidth={1.5} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                AU
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-[11px] text-muted-foreground">Branch Manager</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
