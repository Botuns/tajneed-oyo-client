"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { IMeeting } from "@/app/types/meetings";
import { cn } from "@/lib/utils";

interface UpcomingMeetingsProps {
    meetings: IMeeting[];
    isLoading?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700",
    ongoing: "bg-primary/10 text-primary",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
};

export function UpcomingMeetings({
    meetings,
    isLoading,
}: UpcomingMeetingsProps) {
    if (isLoading) {
        return <UpcomingMeetingsSkeleton />;
    }

    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="section-header">Upcoming Meetings</h3>
                <Link
                    href="/dashboard/meetings"
                    className="text-xs font-medium text-primary hover:underline"
                >
                    View All
                </Link>
            </div>
            <div className="divide-y divide-border">
                {meetings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <CalendarDays className="mb-3 size-10 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No upcoming meetings
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            Schedule a meeting to get started
                        </p>
                    </div>
                ) : (
                    meetings.map((meeting) => (
                        <MeetingItem key={meeting.id} meeting={meeting} />
                    ))
                )}
            </div>
        </div>
    );
}

function MeetingItem({ meeting }: { meeting: IMeeting }) {
    const meetingDate = new Date(meeting.date);

    return (
        <div className="flex items-start gap-4 p-4 transition-colors duration-150 hover:bg-muted/50">
            <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
                <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    {format(meetingDate, "MMM")}
                </span>
                <span className="text-lg font-bold leading-none text-foreground">
                    {format(meetingDate, "dd")}
                </span>
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="truncate text-sm font-medium text-foreground">
                        {meeting.title}
                    </h4>
                    <span
                        className={cn(
                            "shrink-0 rounded px-2 py-0.5 text-[10px] font-medium capitalize",
                            STATUS_STYLES[meeting.status] || STATUS_STYLES.scheduled
                        )}
                    >
                        {meeting.status}
                    </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {meeting.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {meeting.attendees} expected
                    </span>
                </div>
            </div>
        </div>
    );
}

export function UpcomingMeetingsSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            </div>
            <div className="divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4">
                        <div className="size-12 animate-pulse rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
