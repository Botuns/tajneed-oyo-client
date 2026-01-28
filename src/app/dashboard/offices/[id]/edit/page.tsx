"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { officeService } from "@/app/services/office";
import { Button } from "@/components/ui/button";
import { EditOfficeForm } from "./edit-form";

export default function EditOfficePage() {
    const params = useParams();
    const officeId = params.id as string;

    const { data: office, isLoading, error } = useQuery({
        queryKey: ["office", officeId],
        queryFn: () => officeService.getById(officeId),
        enabled: !!officeId,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="size-9 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !office) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="mb-4 size-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Office not found</h2>
                <p className="text-sm text-muted-foreground">
                    This office may have been deleted.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/offices">Back to Offices</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/offices/${officeId}`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Office</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update details for &ldquo;{office.name}&rdquo;
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="mx-auto max-w-2xl">
                <EditOfficeForm office={office} />
            </div>
        </div>
    );
}
