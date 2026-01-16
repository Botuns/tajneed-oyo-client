"use client";
import { Suspense } from "react";
import { MeetingTable } from "./meeting-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetings } from "@/hooks/meetings/queries/useMeetings";

export default function MeetingDashboard() {
  const router = useRouter();
  
  function navigateToCreateMeeting() {
    router.push("meetings/create");
  }
  
  const { data } = useMeetings({ page: 1, limit: 10 });
  const meetings = data?.data ?? [];
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Manage and schedule all meetings.
          </p>
        </div>
        <Button onClick={navigateToCreateMeeting} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>
            A list of all scheduled meetings and their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {meetings.length }
          <Suspense fallback={<div>Loading...</div>}>
            <MeetingTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}