"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    MapPin,
    Trash2,
    User,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

import { meetingService } from "@/app/services/meetings";
import { officerService } from "@/app/services/officer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    scheduled: { bg: "bg-blue-50", text: "text-blue-700", label: "Scheduled" },
    SCHEDULED: { bg: "bg-blue-50", text: "text-blue-700", label: "Scheduled" },
    ongoing: { bg: "bg-primary/10", text: "text-primary", label: "Ongoing" },
    ONGOING: { bg: "bg-primary/10", text: "text-primary", label: "Ongoing" },
    completed: { bg: "bg-muted", text: "text-muted-foreground", label: "Completed" },
    COMPLETED: { bg: "bg-muted", text: "text-muted-foreground", label: "Completed" },
    cancelled: { bg: "bg-destructive/10", text: "text-destructive", label: "Cancelled" },
    CANCELLED: { bg: "bg-destructive/10", text: "text-destructive", label: "Cancelled" },
};

function InfoCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
        </div>
    );
}

export default function MeetingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const meetingId = params.id as string;

    const { data: meeting, isLoading } = useQuery({
        queryKey: ["meeting", meetingId],
        queryFn: () => meetingService.getById(meetingId),
        enabled: !!meetingId,
    });

    const { data: officers = [] } = useQuery({
        queryKey: ["officers"],
        queryFn: () => officerService.getAll(),
        staleTime: 60000,
    });

    const deleteMutation = useMutation({
        mutationFn: () => meetingService.delete(meetingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            router.push("/dashboard/meetings");
        },
    });

    const getOfficerName = (id: string) => {
        const officer = officers.find((o) => o._id === id);
        if (officer) {
            const firstName = (officer as { firstName?: string }).firstName;
            const lastName = (officer as { lastName?: string }).lastName;
            if (firstName && lastName) return `${firstName} ${lastName}`;
            return (officer as { name?: string }).name || officer.email || id;
        }
        return id.length > 12 ? `${id.slice(0, 8)}...` : id;
    };

    const getOfficerEmail = (id: string) => {
        const officer = officers.find((o) => o._id === id);
        return officer?.email || "";
    };

    const getInitials = (id: string) => {
        const officer = officers.find((o) => o._id === id);
        if (officer) {
            const firstName = (officer as { firstName?: string }).firstName;
            const lastName = (officer as { lastName?: string }).lastName;
            if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`;
        }
        return "?";
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="size-9 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="mb-4 size-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Meeting not found</h2>
                <p className="text-sm text-muted-foreground">
                    This meeting may have been deleted.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/meetings">Back to Meetings</Link>
                </Button>
            </div>
        );
    }

    const status = STATUS_STYLES[meeting.status] || STATUS_STYLES.scheduled;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/meetings">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {meeting.title}
                            </h1>
                            <span
                                className={cn(
                                    "rounded px-2.5 py-1 text-xs font-medium capitalize",
                                    status.bg,
                                    status.text
                                )}
                            >
                                {status.label}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {meeting.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/meetings/${meetingId}/edit`}>
                            <Edit className="mr-2 size-4" />
                            Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-destructive">
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete meeting?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    meeting &ldquo;{meeting.title}&rdquo; and all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deleteMutation.mutate()}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Meeting Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                    icon={Calendar}
                    label="Date"
                    value={meeting.date ? format(new Date(meeting.date), "MMMM dd, yyyy") : "N/A"}
                />
                <InfoCard
                    icon={Clock}
                    label="Time"
                    value={
                        meeting.startTime
                            ? `${format(new Date(meeting.startTime), "h:mm a")}${meeting.endTime
                                ? ` - ${format(new Date(meeting.endTime), "h:mm a")}`
                                : ""
                            }`
                            : "N/A"
                    }
                />
                <InfoCard
                    icon={MapPin}
                    label="Location"
                    value={meeting.location || "No location"}
                />
                <InfoCard
                    icon={User}
                    label="Organizer"
                    value={getOfficerName(meeting.organizer)}
                />
            </div>

            {/* Attendance Overview */}
            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                            <Users className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">Attendance</h3>
                            <p className="text-xs text-muted-foreground">
                                {meeting.totalCheckedIn || 0} of {meeting.expectedAttendees?.length || 0} checked in
                            </p>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {meeting.expectedAttendees && meeting.expectedAttendees.length > 0 ? (
                        meeting.expectedAttendees.map((attendeeId: string) => {
                            const checkedIn = meeting.checkedInOfficers?.find(
                                (o) => o.id === attendeeId
                            );
                            return (
                                <div
                                    key={attendeeId}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "flex size-9 items-center justify-center rounded-full text-xs font-medium",
                                                checkedIn
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-primary/10 text-primary"
                                            )}
                                        >
                                            {checkedIn ? (
                                                <CheckCircle className="size-4" />
                                            ) : (
                                                getInitials(attendeeId)
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {checkedIn?.name || getOfficerName(attendeeId)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {checkedIn?.email || getOfficerEmail(attendeeId)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {checkedIn ? (
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
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No attendees assigned to this meeting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
