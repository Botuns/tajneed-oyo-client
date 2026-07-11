"use client";

import * as React from "react";
import { format } from "date-fns";
import {
    AlertCircle,
    CheckCircle,
    Download,
    Search,
    Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { officeService } from "@/app/services/office";
import { IMeeting } from "@/app/types/meetings";
import { IOfficer } from "@/app/types/officer";
import {
    IBreakdownAttendance,
    IPopulatedAttendee,
} from "@/app/types/attendance";
import { useMeetingBreakdown } from "@/hooks/attendance/queries/useMeetingBreakdown";
import { downloadCsv } from "@/app/utils/csv";

type TabKey = "all" | "in" | "out";

interface RosterRow {
    id: string;
    name: string;
    email: string;
    position: string;
    dila: string;
    offices: string;
    uniqueCode: string;
    checkedIn: boolean;
    checkInTime?: string;
}

function rowInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.charAt(0) ?? "";
    const b = parts[1]?.charAt(0) ?? "";
    return `${a}${b}`.toUpperCase() || "?";
}

function StatTile({
    label,
    value,
    tone = "default",
}: {
    label: string;
    value: string | number;
    tone?: "default" | "green" | "amber" | "primary";
}) {
    const toneClass =
        tone === "green"
            ? "text-green-600 dark:text-green-400"
            : tone === "amber"
                ? "text-amber-600 dark:text-amber-400"
                : tone === "primary"
                    ? "text-primary"
                    : "text-foreground";
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={cn("mt-1 text-2xl font-semibold", toneClass)}>{value}</p>
        </div>
    );
}

export function AttendanceRoster({
    meeting,
    officers,
}: {
    meeting: IMeeting;
    officers: IOfficer[];
}) {
    const [tab, setTab] = React.useState<TabKey>("all");
    const [query, setQuery] = React.useState("");

    const meetingId = meeting._id || meeting.id;

    // Office id -> name, so we can show/export real office names.
    const { data: officesResponse } = useQuery({
        queryKey: ["offices", "all"],
        queryFn: () => officeService.getAll({ page: 1, limit: 500 }),
        staleTime: 60000,
    });

    // Breakdown gives us the actual check-in time per attendee.
    const { data: breakdown } = useMeetingBreakdown(meetingId);

    const officeNameById = React.useMemo(() => {
        const map: Record<string, string> = {};
        for (const office of officesResponse?.data ?? []) {
            map[office._id] = office.name;
        }
        return map;
    }, [officesResponse]);

    const officerById = React.useMemo(() => {
        const map = new Map<string, IOfficer>();
        for (const officer of officers) map.set(officer._id, officer);
        return map;
    }, [officers]);

    const checkInTimeById = React.useMemo(() => {
        const map = new Map<string, string>();
        if (!breakdown) return map;
        const lists: IBreakdownAttendance[] = [
            ...(breakdown.officers ?? []),
            ...(breakdown.dilaQaids ?? []),
            ...(breakdown.mulk ?? []),
        ];
        for (const record of lists) {
            const user = record.userId;
            const id =
                typeof user === "object" && user
                    ? (user as IPopulatedAttendee)._id
                    : (user as string);
            if (id && record.checkInTime) map.set(id, record.checkInTime);
        }
        return map;
    }, [breakdown]);

    const rows = React.useMemo<RosterRow[]>(() => {
        const checkedInMap = new Map(
            (meeting.checkedInOfficers ?? []).map((c) => [c.id, c])
        );
        // Union of expected attendees and anyone who checked in (in case someone
        // checked in without being pre-assigned).
        const ids = new Set<string>([
            ...(meeting.expectedAttendees ?? []),
            ...(meeting.checkedInOfficers ?? []).map((c) => c.id),
        ]);

        const officeNames = (officer?: IOfficer) =>
            (officer?.offices ?? [])
                .map((oid) => officeNameById[oid])
                .filter(Boolean)
                .join(", ");

        return Array.from(ids)
            .map((id) => {
                const officer = officerById.get(id);
                const checkedIn = checkedInMap.get(id);
                const name =
                    checkedIn?.name ||
                    (officer
                        ? `${officer.firstName} ${officer.lastName}`.trim()
                        : id);
                return {
                    id,
                    name,
                    email: checkedIn?.email || officer?.email || "",
                    position: officer?.position || "",
                    dila: officer?.dila || "",
                    offices: officeNames(officer) || officer?.position || "",
                    uniqueCode: officer?.uniqueCode || "",
                    checkedIn: checkedInMap.has(id),
                    checkInTime: checkInTimeById.get(id),
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [meeting, officerById, officeNameById, checkInTimeById]);

    const total = rows.length;
    const checkedInCount = rows.filter((r) => r.checkedIn).length;
    const notCheckedIn = total - checkedInCount;
    const rate = total > 0 ? Math.round((checkedInCount / total) * 100) : 0;

    const tabs: { key: TabKey; label: string; count: number }[] = [
        { key: "all", label: "All", count: total },
        { key: "in", label: "Checked In", count: checkedInCount },
        { key: "out", label: "Not Checked In", count: notCheckedIn },
    ];

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return rows.filter((r) => {
            if (tab === "in" && !r.checkedIn) return false;
            if (tab === "out" && r.checkedIn) return false;
            if (!q) return true;
            return (
                r.name.toLowerCase().includes(q) ||
                r.email.toLowerCase().includes(q) ||
                r.position.toLowerCase().includes(q) ||
                r.dila.toLowerCase().includes(q) ||
                r.uniqueCode.toLowerCase().includes(q)
            );
        });
    }, [rows, tab, query]);

    const handleExport = () => {
        const scope =
            tab === "in"
                ? "checked-in"
                : tab === "out"
                    ? "not-checked-in"
                    : "all";
        const header = [
            "S/N",
            "Name",
            "Email",
            "Position",
            "Office(s)",
            "Dila",
            "Unique Code",
            "Status",
            "Check-in Time",
        ];
        const body = filtered.map((r, i) => [
            i + 1,
            r.name,
            r.email,
            r.position,
            r.offices,
            r.dila,
            r.uniqueCode,
            r.checkedIn ? "Checked In" : "Pending",
            r.checkInTime ? format(new Date(r.checkInTime), "yyyy-MM-dd HH:mm") : "",
        ]);
        const safeTitle = (meeting.title || "meeting")
            .replace(/[^\w-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        downloadCsv(`${safeTitle}-${scope}.csv`, [header, ...body]);
    };

    return (
        <div className="rounded-xl border border-border bg-card">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                        <Users className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Attendance</h3>
                        <p className="text-xs text-muted-foreground">
                            {checkedInCount} of {total} checked in · {rate}% attendance
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={filtered.length === 0}
                >
                    <Download className="mr-2 size-4" />
                    Export{tab !== "all" ? ` (${tabs.find((t) => t.key === tab)?.label})` : ""}
                </Button>
            </div>

            {/* Insight tiles */}
            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatTile label="Expected" value={total} />
                <StatTile label="Checked In" value={checkedInCount} tone="green" />
                <StatTile label="Not Checked In" value={notCheckedIn} tone="amber" />
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Attendance Rate</p>
                    <p className="mt-1 text-2xl font-semibold text-primary">{rate}%</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${rate}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs + search */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
                <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTab(t.key)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                                tab === t.key
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t.label}
                            <span
                                className={cn(
                                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                                    tab === t.key
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-background/60 text-muted-foreground"
                                )}
                            >
                                {t.count}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search name, code, dila…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-border">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        {rows.length === 0
                            ? "No attendees assigned to this meeting"
                            : "No one matches this filter."}
                    </div>
                ) : (
                    filtered.map((r) => (
                        <div
                            key={r.id}
                            className="flex items-center justify-between gap-3 p-4"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={cn(
                                        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                                        r.checkedIn
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-primary/10 text-primary"
                                    )}
                                >
                                    {r.checkedIn ? (
                                        <CheckCircle className="size-4" />
                                    ) : (
                                        rowInitials(r.name)
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{r.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {[r.position, r.dila].filter(Boolean).join(" · ") ||
                                            r.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                {r.checkedIn && r.checkInTime && (
                                    <span className="hidden text-xs text-muted-foreground sm:inline">
                                        {format(new Date(r.checkInTime), "h:mm a")}
                                    </span>
                                )}
                                {r.checkedIn ? (
                                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <CheckCircle className="size-3" />
                                        Checked In
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                        <AlertCircle className="size-3" />
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
