"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, UserCheck } from "lucide-react";
import { IAttendance, AttendanceStatus } from "@/app/types/attendance";
import { cn } from "@/lib/utils";

interface RecentAttendanceProps {
    attendanceRecords: IAttendance[];
    isLoading?: boolean;
}

const STATUS_STYLES: Record<AttendanceStatus, string> = {
    [AttendanceStatus.PRESENT]: "bg-primary/10 text-primary",
    [AttendanceStatus.ABSENT]: "bg-destructive/10 text-destructive",
    [AttendanceStatus.LATE]: "bg-amber-100 text-amber-700",
    [AttendanceStatus.EXCUSED]: "bg-blue-50 text-blue-700",
};

export function RecentAttendance({
    attendanceRecords,
    isLoading,
}: RecentAttendanceProps) {
    if (isLoading) {
        return <RecentAttendanceSkeleton />;
    }

    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="section-header">Team Members</h3>
                <Link
                    href="/dashboard/officers"
                    className="text-xs font-medium text-primary hover:underline"
                >
                    View All
                </Link>
            </div>
            <div className="divide-y divide-border">
                {attendanceRecords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <UserCheck className="mb-3 size-10 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No recent activity
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            Check-ins will appear here
                        </p>
                    </div>
                ) : (
                    attendanceRecords.slice(0, 6).map((record) => (
                        <AttendanceItem key={record._id} record={record} />
                    ))
                )}
            </div>
        </div>
    );
}

function AttendanceItem({ record }: { record: IAttendance }) {
    const checkInTime = new Date(record.checkInTime);
    const officerName = record.officer
        ? `${record.officer.firstName} ${record.officer.lastName}`
        : "Unknown Officer";
    const initials = record.officer
        ? `${record.officer.firstName.charAt(0)}${record.officer.lastName.charAt(0)}`
        : "??";
    const role = "Officer";

    return (
        <div className="flex items-center justify-between p-4 transition-colors duration-150 hover:bg-muted/50">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground">{officerName}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {format(checkInTime, "h:mm a")}
                </span>
                <span
                    className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-medium capitalize",
                        STATUS_STYLES[record.status]
                    )}
                >
                    {record.status.toLowerCase()}
                </span>
            </div>
        </div>
    );
}

export function RecentAttendanceSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            </div>
            <div className="divide-y divide-border">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 animate-pulse rounded-full bg-muted" />
                            <div className="space-y-1">
                                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    );
}
