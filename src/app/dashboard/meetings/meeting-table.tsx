"use client";
// import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMeetings } from "@/hooks/meetings/queries/useMeetings";
import { IMeeting } from "@/app/types/meetings";
import { format } from "date-fns";

type MeetingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

const officers = [
  { id: "507f1f77bcf86cd799439012", name: "John Doe" },
  { id: "507f1f77bcf86cd799439013", name: "Jane Smith" },
  { id: "507f1f77bcf86cd799439014", name: "Bob Johnson" },
];

export function MeetingTable() {
  const router = useRouter();
  const { data, isLoading } = useMeetings({ page: 1, limit: 10 });
  const meetings = data?.data ?? [];

  // Helper to get organizer name by id
  const getOrganizerName = (id: string) => {
    const officer = officers.find((o) => o.id === id);
    return officer ? officer.name : id;
  };

  const getStatusBadge = (status: MeetingStatus) => {
    const statusConfig: Record<MeetingStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      scheduled: { label: "Scheduled", variant: "default" },
      ongoing: { label: "Ongoing", variant: "secondary" },
      completed: { label: "Completed", variant: "outline" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };

    // Fallback to scheduled if status is undefined or invalid
    const config = statusConfig[status] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Helper to determine status based on date
  const getEffectiveStatus = (meeting: IMeeting) => {
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

  const handleView = (id: string) => {
    router.push(`/meetings/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/meetings/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
    console.log("Delete meeting:", id);
  };

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading meetings...</div>;
  }

  if (!meetings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No meetings scheduled</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Get started by creating your first meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting: IMeeting) => (
            <TableRow key={meeting.id}>
              <TableCell className="font-medium">{meeting.title}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {meeting.date ? format(new Date(meeting.date), "MMM dd, yyyy") : "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {meeting.time || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{meeting.location || "N/A"}</TableCell>
              <TableCell>{getOrganizerName(meeting.organizer)}</TableCell>
              <TableCell>
                <span className="text-sm">{meeting.attendees || 0} people</span>
              </TableCell>
              <TableCell>
                {getStatusBadge(getEffectiveStatus(meeting) as MeetingStatus)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleView(meeting.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(meeting.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Meeting
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(meeting.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}