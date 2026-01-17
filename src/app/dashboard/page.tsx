"use client";

import * as React from "react";
import {
  CalendarDays,
  Clock,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  useDashboardStats,
  useUpcomingMeetings,
  useAbsenceAlerts,
  useMeetingAttendance,
} from "@/hooks/dashboard/use-dashboard";
import {
  StatCard,
  StatCardSkeleton,
  DualStatCard,
  AttendanceChart,
  AttendanceChartSkeleton,
  UpcomingMeetings,
  RecentAttendance,
  AbsenceAlerts,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: meetings = [], isLoading: meetingsLoading } =
    useUpcomingMeetings(5);
  const { data: absences = [], isLoading: absencesLoading } =
    useAbsenceAlerts();

  const activeMeetingId = React.useMemo(() => {
    const ongoing = meetings.find((m) => m.status === "ongoing");
    return ongoing?.id ?? null;
  }, [meetings]);

  const { data: recentAttendance = [], isLoading: attendanceLoading } =
    useMeetingAttendance(activeMeetingId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tajneed Oyo Attendance Overview
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Row - Reference Style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <DualStatCard
              icon={Package}
              leftStat={{
                label: "Total",
                value: stats?.totalOfficers ?? 0,
                sublabel: "Officers",
              }}
              rightStat={{
                label: "Active",
                value: stats?.totalOfficers ?? 0,
                sublabel: "Members",
              }}
            />
            <DualStatCard
              icon={CalendarDays}
              leftStat={{
                label: "Upcoming",
                value: stats?.upcomingMeetingsCount ?? 0,
              }}
              rightStat={{
                label: "Completed",
                value: 12,
                sublabel: "This month",
              }}
              highlighted
            />
            <DualStatCard
              icon={TrendingUp}
              leftStat={{
                label: "Rate",
                value: `${stats?.attendanceRate ?? 0}%`,
              }}
              rightStat={{
                label: "Total",
                value: 256,
                sublabel: "Check-ins",
              }}
            />
            <StatCard
              title="Pending Check-ins"
              value={stats?.pendingCheckIns ?? 0}
              subtitle="Not yet checked in"
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Absence Alerts */}
      <AbsenceAlerts absences={absences} isLoading={absencesLoading} />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Chart */}
        {statsLoading ? (
          <AttendanceChartSkeleton />
        ) : (
          <AttendanceChart />
        )}

        {/* Right Column - Upcoming Meetings */}
        <UpcomingMeetings meetings={meetings} isLoading={meetingsLoading} />
      </div>

      {/* Recent Activity */}
      <RecentAttendance
        attendanceRecords={recentAttendance}
        isLoading={attendanceLoading}
      />
    </div>
  );
}
