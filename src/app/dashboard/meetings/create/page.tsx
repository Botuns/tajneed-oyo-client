import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateMeetingForm } from "@/components/create-meeting-form";
import { Button } from "@/components/ui/button";

export default function CreateMeetingPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/meetings">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create Meeting
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule a new meeting for officers to check in
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="mx-auto max-w-3xl">
        <CreateMeetingForm />
      </div>
    </div>
  );
}
