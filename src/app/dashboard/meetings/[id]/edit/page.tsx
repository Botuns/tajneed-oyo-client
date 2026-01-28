"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { meetingService } from "@/app/services/meetings";
import { Button } from "@/components/ui/button";
import { EditMeetingForm } from "./edit-form";

export default function EditMeetingPage() {
    const params = useParams();
    const meetingId = params.id as string;

    const { data: meeting, isLoading, error } = useQuery({
        queryKey: ["meeting", meetingId],
        queryFn: () => meetingService.getById(meetingId),
        enabled: !!meetingId,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="size-9 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !meeting) {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/meetings/${meetingId}`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Meeting</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update meeting details for &ldquo;{meeting.title}&rdquo;
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="mx-auto max-w-3xl">
                <EditMeetingForm meeting={meeting} />
            </div>
        </div>
    );
}
