import { CreateMeetingForm } from "@/components/create-meeting-form";

export default function CreateMeetingPage() {
  return (
    <div className="container max-w-3xl py-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Meeting</h1>
        <p className="text-muted-foreground">
          Schedule a new meeting for officers to check in
        </p>
      </div>
      <CreateMeetingForm />
    </div>
  );
}
