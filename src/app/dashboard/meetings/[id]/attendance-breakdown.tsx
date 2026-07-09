"use client";

import * as React from "react";
import { format } from "date-fns";
import { Loader2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    useMeetingBreakdown,
    useMeetingStatsBreakdown,
} from "@/hooks/attendance/queries/useMeetingBreakdown";
import {
    AUXILIARY_LABELS,
    AuxiliaryType,
    IBreakdownAttendance,
    IPopulatedAttendee,
    MeetingAttendanceBreakdown,
    MeetingStatsBreakdown,
    RoleStats,
} from "@/app/types/attendance";

type RoleKey = keyof Omit<MeetingStatsBreakdown, "totals">;

const ROLES: { key: RoleKey; label: string }[] = [
    { key: "officers", label: "Officers" },
    { key: "dilaQaids", label: "Dila Qaids" },
    { key: "mulk", label: "Mulk" },
    { key: "guests", label: "Guests" },
];

const STATUS_STYLES: Record<string, string> = {
    PRESENT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    LATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ABSENT: "bg-destructive/10 text-destructive",
    EXCUSED: "bg-muted text-muted-foreground",
};

function asAttendee(userId: string | IPopulatedAttendee): IPopulatedAttendee | null {
    return typeof userId === "object" && userId !== null ? userId : null;
}

function attendeeName(record: IBreakdownAttendance): string {
    const user = asAttendee(record.userId);
    if (user?.firstName || user?.lastName) {
        return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    }
    if (typeof record.userId === "string") {
        return record.userId.length > 10
            ? `${record.userId.slice(0, 8)}…`
            : record.userId;
    }
    return "Unknown";
}

function attendeeMeta(record: IBreakdownAttendance): string {
    const user = asAttendee(record.userId);
    if (!user) return "";
    // Officer: show position/dila. Guest: show auxiliary + purpose.
    if (user.position || user.dila) {
        return [user.position, user.dila].filter(Boolean).join(" · ");
    }
    if (user.auxiliary || user.purpose) {
        const aux = user.auxiliary
            ? AUXILIARY_LABELS[user.auxiliary as AuxiliaryType]
            : undefined;
        return [aux, user.purpose].filter(Boolean).join(" · ");
    }
    return user.email ?? "";
}

function initials(record: IBreakdownAttendance): string {
    const user = asAttendee(record.userId);
    const f = user?.firstName?.charAt(0) ?? "";
    const l = user?.lastName?.charAt(0) ?? "";
    return `${f}${l}`.toUpperCase() || "?";
}

function RoleSummaryCard({
    label,
    stats,
}: {
    label: string;
    stats: RoleStats;
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats.total}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span className="text-green-600 dark:text-green-400">
                    {stats.present} present
                </span>
                {stats.late > 0 && <span>{stats.late} late</span>}
                {stats.absent > 0 && <span>{stats.absent} absent</span>}
                {stats.excused > 0 && <span>{stats.excused} excused</span>}
            </div>
        </div>
    );
}

function RoleList({
    label,
    records,
}: {
    label: string;
    records: IBreakdownAttendance[];
}) {
    if (records.length === 0) return null;

    return (
        <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label} ({records.length})
            </h4>
            <div className="divide-y divide-border rounded-lg border border-border">
                {records.map((record) => (
                    <div
                        key={record._id}
                        className="flex items-center justify-between gap-3 p-3"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {initials(record)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {attendeeName(record)}
                                </p>
                                {attendeeMeta(record) && (
                                    <p className="truncate text-xs text-muted-foreground">
                                        {attendeeMeta(record)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(record.checkInTime), "h:mm a")}
                            </span>
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                    STATUS_STYLES[record.status] ?? STATUS_STYLES.EXCUSED
                                )}
                            >
                                {record.status.toLowerCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AttendanceBreakdown({ meetingId }: { meetingId: string }) {
    const { data: breakdown, isLoading, isError } = useMeetingBreakdown(meetingId);
    const { data: stats } = useMeetingStatsBreakdown(meetingId);

    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Users className="size-4 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold">Attendance by Role</h3>
                    <p className="text-xs text-muted-foreground">
                        Officers, Dila Qaids, mulk members and walk-in guests
                    </p>
                </div>
            </div>

            <div className="p-5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Loader2 className="size-5 animate-spin" />
                    </div>
                ) : isError ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Could not load the attendance breakdown.
                    </p>
                ) : (
                    <BreakdownBody breakdown={breakdown} stats={stats} />
                )}
            </div>
        </div>
    );
}

function BreakdownBody({
    breakdown,
    stats,
}: {
    breakdown?: MeetingAttendanceBreakdown;
    stats?: MeetingStatsBreakdown;
}) {
    const isEmpty =
        !breakdown ||
        ROLES.every((r) => (breakdown[r.key]?.length ?? 0) === 0);

    if (isEmpty) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                No one has checked in to this meeting yet.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {stats && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {ROLES.map((r) => (
                        <RoleSummaryCard key={r.key} label={r.label} stats={stats[r.key]} />
                    ))}
                </div>
            )}

            <div className="space-y-5">
                {ROLES.map((r) => (
                    <RoleList
                        key={r.key}
                        label={r.label}
                        records={breakdown[r.key] ?? []}
                    />
                ))}
            </div>
        </div>
    );
}
