import { CreateOfficeForm } from "@/components/create-office-form";

export default function CreateOfficePage() {
  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Office</h1>
        <p className="text-muted-foreground">
          Set up a new office or department in your organization
        </p>
      </div>
      <CreateOfficeForm />
    </div>
  );
}
