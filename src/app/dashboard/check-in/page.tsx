"use client";

import * as React from "react";
import { format } from "date-fns";
import {
    CheckCircle2,
    Fingerprint,
    KeyRound,
    Loader2,
    UserCheck,
    UserPlus,
    Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useMulkCheckIn } from "@/hooks/attendance/mutations/useMulkCheckIn";
import { useGuestCheckIn } from "@/hooks/attendance/mutations/useGuestCheckIn";
import { IMeeting } from "@/app/types/meetings";
import {
    AuxiliaryType,
    AUXILIARY_LABELS,
    IAttendance,
    ICheckInGuestDto,
} from "@/app/types/attendance";
import {
    OFFICER_CODE_PREFIX,
    normalizeOfficerCode,
} from "@/app/utils/unique-code";

type CheckInMode = "officer" | "mulk" | "guest";

const MODES: { value: CheckInMode; label: string; icon: React.ElementType }[] = [
    { value: "officer", label: "Officer", icon: UserCheck },
    { value: "mulk", label: "Mulk Member", icon: Users },
    { value: "guest", label: "Guest", icon: UserPlus },
];

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

/**
 * Unique-code check-in used by both officers and mulk members. They share the
 * same input shape; only the endpoint (via the passed hook) differs.
 */
function CodeCheckInPanel({
    meetingId,
    variant,
    disabled,
}: {
    meetingId: string;
    variant: "officer" | "mulk";
    disabled: boolean;
}) {
    const officerMutation = useCheckIn();
    const mulkMutation = useMulkCheckIn();
    const mutation = variant === "officer" ? officerMutation : mulkMutation;

    const [uniqueCode, setUniqueCode] = React.useState("");
    const [lastCheckIn, setLastCheckIn] = React.useState<IAttendance | null>(
        null
    );

    const label = variant === "officer" ? "Officer" : "Mulk Member";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = normalizeOfficerCode(uniqueCode);
        if (!meetingId || !fullCode) return;

        mutation.mutate(
            { meetingId, uniqueCode: fullCode },
            {
                onSuccess: (data) => {
                    setLastCheckIn(data);
                    setUniqueCode("");
                },
            }
        );
    };

    const handleReset = () => {
        setLastCheckIn(null);
        setUniqueCode("");
    };

    return (
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
                            Type the {label.toLowerCase()}&apos;s number — e.g.{" "}
                            <span className="font-mono">42</span>
                        </p>
                    </div>
                </div>

                {lastCheckIn ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle2 className="size-6 shrink-0" />
                            <div>
                                <p className="font-semibold">
                                    {lastCheckIn.officer?.firstName
                                        ? `${lastCheckIn.officer.firstName} ${lastCheckIn.officer?.lastName ?? ""}`
                                        : `${label} checked in`}
                                </p>
                                <p className="text-sm opacity-80">
                                    Checked in at{" "}
                                    {format(new Date(lastCheckIn.checkInTime), "h:mm a")}
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleReset} variant="outline" className="w-full">
                            <UserCheck className="mr-2 size-4" />
                            Check In Another {label}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div
                            className={cn(
                                "flex h-12 items-center overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring",
                                (disabled || mutation.isPending) && "opacity-50"
                            )}
                        >
                            <span className="select-none border-r border-input bg-muted px-3 font-mono text-lg leading-[3rem] tracking-widest text-muted-foreground">
                                {OFFICER_CODE_PREFIX}
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="42"
                                value={uniqueCode}
                                onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                                className="h-full flex-1 bg-transparent px-3 text-lg font-mono tracking-widest text-foreground outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
                                disabled={disabled || mutation.isPending}
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Just the number is enough. You can also paste a full code.
                        </p>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={disabled || !uniqueCode.trim() || mutation.isPending}
                        >
                            {mutation.isPending ? (
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
    );
}

const EMPTY_GUEST = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    auxiliary: "" as AuxiliaryType | "",
    state: "",
    purpose: "",
};

/**
 * Walk-in guest capture. Collects the full guest profile the backend requires;
 * the Guest record is created inline on submit.
 */
function GuestCheckInPanel({
    meetingId,
    disabled,
}: {
    meetingId: string;
    disabled: boolean;
}) {
    const mutation = useGuestCheckIn();
    const [form, setForm] = React.useState({ ...EMPTY_GUEST });
    const [done, setDone] = React.useState(false);

    const setField = (key: keyof typeof form, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const isComplete =
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        form.phoneNumber.trim() &&
        form.auxiliary &&
        form.state.trim() &&
        form.purpose.trim();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!meetingId || !isComplete) return;

        const dto: ICheckInGuestDto = {
            meetingId,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
            auxiliary: form.auxiliary as AuxiliaryType,
            state: form.state.trim(),
            purpose: form.purpose.trim(),
        };

        mutation.mutate(dto, {
            onSuccess: () => setDone(true),
        });
    };

    const handleReset = () => {
        setForm({ ...EMPTY_GUEST });
        setDone(false);
    };

    return (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <UserPlus className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Guest Details</h3>
                    <p className="text-xs text-muted-foreground">
                        Capture a walk-in who is not a registered officer
                    </p>
                </div>
            </div>

            {done ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle2 className="size-6 shrink-0" />
                        <div>
                            <p className="font-semibold">Guest checked in</p>
                            <p className="text-sm opacity-80">
                                Their details have been recorded for this meeting.
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleReset} variant="outline" className="w-full">
                        <UserPlus className="mr-2 size-4" />
                        Check In Another Guest
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="guest-firstName">First name</Label>
                            <Input
                                id="guest-firstName"
                                value={form.firstName}
                                onChange={(e) => setField("firstName", e.target.value)}
                                disabled={disabled || mutation.isPending}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="guest-lastName">Last name</Label>
                            <Input
                                id="guest-lastName"
                                value={form.lastName}
                                onChange={(e) => setField("lastName", e.target.value)}
                                disabled={disabled || mutation.isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="guest-email">Email</Label>
                            <Input
                                id="guest-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                disabled={disabled || mutation.isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="guest-phone">Phone number</Label>
                            <Input
                                id="guest-phone"
                                type="tel"
                                value={form.phoneNumber}
                                onChange={(e) => setField("phoneNumber", e.target.value)}
                                disabled={disabled || mutation.isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="guest-auxiliary">Auxiliary</Label>
                            <Select
                                value={form.auxiliary || undefined}
                                onValueChange={(v) => setField("auxiliary", v)}
                                disabled={disabled || mutation.isPending}
                            >
                                <SelectTrigger id="guest-auxiliary">
                                    <SelectValue placeholder="Select auxiliary..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(AuxiliaryType).map((aux) => (
                                        <SelectItem key={aux} value={aux}>
                                            {AUXILIARY_LABELS[aux]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="guest-state">State</Label>
                            <Input
                                id="guest-state"
                                value={form.state}
                                onChange={(e) => setField("state", e.target.value)}
                                disabled={disabled || mutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="guest-purpose">Purpose / Post</Label>
                        <Input
                            id="guest-purpose"
                            placeholder="e.g., Observer, Mulk Officer, Special guest"
                            value={form.purpose}
                            onChange={(e) => setField("purpose", e.target.value)}
                            disabled={disabled || mutation.isPending}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={disabled || !isComplete || mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Checking in...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 size-4" />
                                Check In Guest
                            </>
                        )}
                    </Button>
                </form>
            )}
        </div>
    );
}

export default function CheckInPage() {
    const { data: meetingsData, isLoading: meetingsLoading } = useMeetings({
        page: 1,
        limit: 100,
    });
    const meetings = React.useMemo(() => meetingsData?.data ?? [], [meetingsData]);

    const [selectedMeetingId, setSelectedMeetingId] = React.useState<string>("");
    const [mode, setMode] = React.useState<CheckInMode>("officer");

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
    const noMeeting = !selectedMeetingId;

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
                    Meeting Check-In
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Check in officers, mulk members, and walk-in guests to a meeting
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

            {meetings.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">
                        No meetings found. Create a meeting first to start checking in
                        attendees.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mode selector */}
                    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
                        {MODES.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setMode(value)}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                                    mode === value
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="size-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Active panel — remount per mode/meeting to reset local state */}
                    {mode === "guest" ? (
                        <GuestCheckInPanel
                            key={`guest-${selectedMeetingId}`}
                            meetingId={selectedMeetingId}
                            disabled={noMeeting}
                        />
                    ) : (
                        <CodeCheckInPanel
                            key={`${mode}-${selectedMeetingId}`}
                            meetingId={selectedMeetingId}
                            variant={mode}
                            disabled={noMeeting}
                        />
                    )}
                </>
            )}
        </div>
    );
}
