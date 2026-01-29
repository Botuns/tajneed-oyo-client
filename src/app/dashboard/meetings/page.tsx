"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { MeetingTable } from "./meeting-table";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetings } from "@/hooks/meetings/queries/useMeetings";

export default function MeetingDashboard() {
  const { data } = useMeetings({ page: 1, limit: 100 });
  const meetings = data?.data ?? [];

  const stats = React.useMemo(() => {
    const now = new Date();
    const normalizeStatus = (s: string) => s.toLowerCase();
    const scheduled = meetings.filter((m) => normalizeStatus(m.status) === "scheduled").length;
    const ongoing = meetings.filter((m) => normalizeStatus(m.status) === "ongoing").length;
    const completed = meetings.filter((m) => normalizeStatus(m.status) === "completed").length;
    const upcoming = meetings.filter((m) => new Date(m.date) > now).length;
    const totalAttendees = meetings.reduce(
      (acc, m) => acc + (m.expectedAttendees?.length || m.attendees || 0),
      0
    );
    return { scheduled, ongoing, completed, upcoming, totalAttendees };
  }, [meetings]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Meetings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and schedule all meetings
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/meetings/create">
            <Plus className="mr-2 size-4" />
            Create Meeting
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="stat-number">{stats.scheduled}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-primary bg-[hsl(var(--primary)/0.08)] p-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Clock className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="stat-number">{stats.ongoing}</p>
            <p className="text-xs text-muted-foreground">Ongoing</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <CalendarCheck className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="stat-number">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Users className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="stat-number">{stats.totalAttendees}</p>
            <p className="text-xs text-muted-foreground">Total Attendees</p>
          </div>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="section-header">All Meetings</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {meetings.length} total meetings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading meetings...
            </div>
          }
        >
          <MeetingTable />
        </Suspense>
      </div>
    </div>
  );
}