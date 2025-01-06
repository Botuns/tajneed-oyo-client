"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-8">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-4">
        <form className="hidden flex-1 sm:block">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full max-w-[300px] pl-8"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 font-normal">
            <span className="size-7 rounded-full bg-muted" />
            <span className="hidden sm:inline-block">Admin User</span>
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
