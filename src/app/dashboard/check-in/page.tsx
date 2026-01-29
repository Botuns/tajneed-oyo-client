"use client";

import * as React from "react";
import { format } from "date-fns";
import {
    CheckCircle2,
    Fingerprint,
    KeyRound,
    Loader2,
    UserCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMeetings } from "@/hooks/meetings/queries/useMeetings";
import { useCheckIn } from "@/hooks/attendance/mutations/useCheckIn";
import { IMeeting } from "@/app/types/meetings";
import { IAttendance } from "@/app/types/attendance";

function normalizeStatus(status: string): string {
    return status.toLowerCase();
}

function getCurrentMonthMeeting(meetings: IMeeting[]): IMeeting | undefined {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Find meeting in current month, preferring scheduled or ongoing status
    const currentMonthMeetings = meetings.filter((m) => {
        const meetingDate = new Date(m.date);
        return (
            meetingDate.getMonth() === currentMonth &&
            meetingDate.getFullYear() === currentYear &&
            normalizeStatus(m.status) !== "cancelled"
        );
    });

    // Prefer ongoing, then scheduled, then completed
    const ongoing = currentMonthMeetings.find(
        (m) => normalizeStatus(m.status) === "ongoing"
    );
    if (ongoing) return ongoing;

    const scheduled = currentMonthMeetings.find(
        (m) => normalizeStatus(m.status) === "scheduled"
    );
    if (scheduled) return scheduled;

    return currentMonthMeetings[0];
}

export default function CheckInPage() {
    const { data: meetingsData, isLoading: meetingsLoading } = useMeetings({
        page: 1,
        limit: 100,
    });
    const meetings = meetingsData?.data ?? [];

    const [selectedMeetingId, setSelectedMeetingId] = React.useState<string>("");
    const [uniqueCode, setUniqueCode] = React.useState("");
    const [lastCheckIn, setLastCheckIn] = React.useState<IAttendance | null>(
        null
    );

    const checkInMutation = useCheckIn();

    // Auto-select current month meeting
    React.useEffect(() => {
        if (meetings.length > 0 && !selectedMeetingId) {
            const currentMonthMeeting = getCurrentMonthMeeting(meetings);
            if (currentMonthMeeting) {
                setSelectedMeetingId(currentMonthMeeting.id);
            }
        }
    }, [meetings, selectedMeetingId]);

    const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId);

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMeetingId || !uniqueCode.trim()) return;

        checkInMutation.mutate(
            { meetingId: selectedMeetingId, uniqueCode: uniqueCode.trim() },
            {
                onSuccess: (data) => {
                    setLastCheckIn(data);
                    setUniqueCode("");
                },
            }
        );
    };

    const handleCheckInAnother = () => {
        setLastCheckIn(null);
        setUniqueCode("");
    };

    if (meetingsLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Officer Check-In
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Check in officers to meetings using their unique code
                </p>
            </div>

            {/* Meeting Selector */}
            <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4">
                    <h3 className="section-header">Select Meeting</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        The current month&apos;s meeting is auto-selected
                    </p>
                </div>

                <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
                    <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Select a meeting..." />
                    </SelectTrigger>
                    <SelectContent>
                        {meetings.map((meeting) => (
                            <SelectItem key={meeting.id} value={meeting.id}>
                                <div className="flex items-center gap-2">
                                    <span>{meeting.title}</span>
                                    <span className="text-muted-foreground">
                                        · {format(new Date(meeting.date), "MMM d, yyyy")}
                                    </span>
                                    {normalizeStatus(meeting.status) === "ongoing" && (
                                        <Badge
                                            variant="default"
                                            className="ml-1 bg-primary/10 text-primary"
                                        >
                                            Ongoing
                                        </Badge>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedMeeting && (
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>
                            <strong className="text-foreground">Date:</strong>{" "}
                            {format(new Date(selectedMeeting.date), "EEEE, MMMM d, yyyy")}
                        </span>
                        <span>
                            <strong className="text-foreground">Location:</strong>{" "}
                            {selectedMeeting.location}
                        </span>
                        <Badge
                            variant="outline"
                            className={cn(
                                "capitalize",
                                normalizeStatus(selectedMeeting.status) === "ongoing" &&
                                "border-primary/50 bg-primary/10 text-primary",
                                normalizeStatus(selectedMeeting.status) === "scheduled" &&
                                "border-blue-500/50 bg-blue-50 text-blue-700"
                            )}
                        >
                            {normalizeStatus(selectedMeeting.status)}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Check-in Methods */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Unique Code - Active */}
                <div className="rounded-xl border-2 border-primary bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <KeyRound className="size-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Unique Code</h3>
                            <p className="text-xs text-muted-foreground">
                                Enter officer&apos;s unique code
                            </p>
                        </div>
                    </div>

                    {lastCheckIn ? (
                        // Success State
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="size-6 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        {lastCheckIn.officer?.firstName}{" "}
                                        {lastCheckIn.officer?.lastName}
                                    </p>
                                    <p className="text-sm opacity-80">
                                        Checked in at{" "}
                                        {format(new Date(lastCheckIn.checkInTime), "h:mm a")}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleCheckInAnother}
                                variant="outline"
                                className="w-full"
                            >
                                <UserCheck className="mr-2 size-4" />
                                Check In Another Officer
                            </Button>
                        </div>
                    ) : (
                        // Input State
                        <form onSubmit={handleCheckIn} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Enter unique code (e.g., OFC-ABC123)"
                                value={uniqueCode}
                                onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                                className="h-12 text-center text-lg font-mono tracking-widest"
                                disabled={!selectedMeetingId || checkInMutation.isPending}
                                autoFocus
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    !selectedMeetingId ||
                                    !uniqueCode.trim() ||
                                    checkInMutation.isPending
                                }
                            >
                                {checkInMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Checking in...
                                    </>
                                ) : (
                                    <>
                                        <UserCheck className="mr-2 size-4" />
                                        Check In
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>

                {/* Fingerprint - Disabled */}
                <div className="relative rounded-xl border border-border bg-card p-6 opacity-60">
                    <Badge
                        variant="secondary"
                        className="absolute right-4 top-4 bg-muted text-muted-foreground"
                    >
                        Coming Soon
                    </Badge>

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Fingerprint className="size-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Fingerprint</h3>
                            <p className="text-xs text-muted-foreground">
                                Biometric check-in (disabled)
                            </p>
                        </div>
                    </div>

                    <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                            Fingerprint scanning will be available soon
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats or Instructions */}
            {!selectedMeeting && meetings.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">
                        No meetings found. Create a meeting first to start checking in
                        officers.
                    </p>
                </div>
            )}
        </div>
    );
}
