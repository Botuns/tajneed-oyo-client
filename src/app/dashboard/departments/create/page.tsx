import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateOfficerForm } from "./create-form";
// import { CreateOfficerForm } from "./create-form";

export default function CreateOfficerPage() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/departments">
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Officer</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Register a new officer in the system
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-2xl">
                <CreateOfficerForm />
            </div>
        </div>
    );
}
