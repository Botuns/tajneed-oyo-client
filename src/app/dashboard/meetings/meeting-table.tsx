"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMeetings } from "@/hooks/meetings/queries/useMeetings";
import { IMeeting, MeetingStatus } from "@/app/types/meetings";
import { officerService } from "@/app/services/officer";
import { meetingService } from "@/app/services/meetings";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MeetingStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  ongoing: "bg-primary/10 text-primary",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export function MeetingTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMeetings({ page: 1, limit: 10 });
  const meetings = data?.data ?? [];

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [meetingToDelete, setMeetingToDelete] = React.useState<IMeeting | null>(null);

  const { data: officers = [] } = useQuery({
    queryKey: ["officers"],
    queryFn: () => officerService.getAll(),
    staleTime: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => meetingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setDeleteDialogOpen(false);
      setMeetingToDelete(null);
    },
  });

  const getOrganizerName = React.useCallback(
    (id: string) => {
      const officer = officers.find((o) => o._id === id);
      if (officer) {
        const firstName = (officer as { firstName?: string }).firstName;
        const lastName = (officer as { lastName?: string }).lastName;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
        return (officer as { name?: string }).name || officer.email || id;
      }
      return id.length > 12 ? `${id.slice(0, 8)}...` : id;
    },
    [officers]
  );

  const getEffectiveStatus = (meeting: IMeeting): MeetingStatus => {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    if (
      (meeting.status === "scheduled" || meeting.status === "ongoing") &&
      meetingDate < now
    ) {
      return "completed";
    }
    return meeting.status;
  };

  const formatMeetingTime = (meeting: IMeeting): string => {
    if (meeting.startTime) {
      try {
        const startDate = new Date(meeting.startTime);
        const endDate = meeting.endTime ? new Date(meeting.endTime) : null;
        const startTime = format(startDate, "h:mm a");
        if (endDate) {
          const endTime = format(endDate, "h:mm a");
          return `${startTime} - ${endTime}`;
        }
        return startTime;
      } catch {
        return meeting.time || "N/A";
      }
    }
    return meeting.time || "N/A";
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/meetings/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/meetings/${id}/edit`);
  };

  const handleDeleteClick = (meeting: IMeeting) => {
    setMeetingToDelete(meeting);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (meetingToDelete) {
      deleteMutation.mutate(meetingToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="size-12 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="mb-4 size-12 text-muted-foreground/40" />
        <h3 className="text-base font-semibold text-foreground">
          No meetings scheduled
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating your first meeting
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-border">
        {meetings.map((meeting: IMeeting) => (
          <div
            key={meeting.id}
            className="flex items-start gap-4 p-4 transition-colors duration-150 hover:bg-muted/50"
          >
            {/* Date Badge */}
            <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
              <span className="text-[10px] font-medium uppercase text-muted-foreground">
                {meeting.date ? format(new Date(meeting.date), "MMM") : "N/A"}
              </span>
              <span className="text-lg font-bold leading-none text-foreground">
                {meeting.date ? format(new Date(meeting.date), "dd") : "--"}
              </span>
            </div>

            {/* Meeting Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-foreground">
                    {meeting.title}
                  </h4>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {meeting.location || "No location"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {meeting.expectedAttendees?.length || meeting.attendees || 0} attendees
                    </span>
                    <span>Organizer: {getOrganizerName(meeting.organizer)}</span>
                  </div>
                </div>

                {/* Time & Status */}
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">
                      {formatMeetingTime(meeting)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-[10px] font-medium capitalize",
                      STATUS_STYLES[getEffectiveStatus(meeting)]
                    )}
                  >
                    {getEffectiveStatus(meeting)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleView(meeting.id)}>
                        <Eye className="mr-2 size-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(meeting.id)}>
                        <Edit className="mr-2 size-4" />
                        Edit Meeting
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(meeting)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              meeting &ldquo;{meetingToDelete?.title}&rdquo; and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}