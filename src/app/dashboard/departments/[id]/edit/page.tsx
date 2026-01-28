"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { officerService } from "@/app/services/officer";
import { Button } from "@/components/ui/button";
import { EditOfficerForm } from "./edit-form";

export default function EditOfficerPage() {
    const params = useParams();
    const officerId = params.id as string;

    const { data: officer, isLoading, error } = useQuery({
        queryKey: ["officer", officerId],
        queryFn: () => officerService.getById(officerId),
        enabled: !!officerId,
    });

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="size-9 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="mx-auto max-w-2xl space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !officer) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="mb-4 size-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Officer not found</h2>
                <p className="text-sm text-muted-foreground">This officer may have been deleted.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/departments">Back to Officers</Link>
                </Button>
            </div>
        );
    }

    const getOfficerName = () => {
        const first = (officer as unknown as { firstName?: string }).firstName;
        const last = (officer as unknown as { lastName?: string }).lastName;
        if (first && last) return `${first} ${last}`;
        return officer.name || officer.email || "Unknown";
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/departments/${officerId}`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Officer</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update details for {getOfficerName()}
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-2xl">
                <EditOfficerForm officer={officer} />
            </div>
        </div>
    );
}
