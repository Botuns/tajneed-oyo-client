"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    ArrowLeft,
    Edit,
    Trash2,
    AlertCircle,
    Mail,
    Phone,
    Shield,
    Calendar,
    Building2,
    QrCode,
} from "lucide-react";

import { officerService } from "@/app/services/officer";
import { officeService } from "@/app/services/office";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IOfficer } from "@/app/types/officer";

function InfoCard({
    icon: Icon,
    label,
    value,
    className,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-3 rounded-lg border border-border bg-card p-4", className)}>
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="text-sm font-medium text-foreground">{value}</div>
            </div>
        </div>
    );
}

export default function OfficerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const officerId = params.id as string;

    const { data: officer, isLoading } = useQuery({
        queryKey: ["officer", officerId],
        queryFn: () => officerService.getById(officerId),
        enabled: !!officerId,
    });

    const { data: officesData } = useQuery({
        queryKey: ["offices"],
        queryFn: () => officeService.getAll({ page: 1, limit: 100 }),
        staleTime: 60000,
    });
    const offices = officesData?.data ?? [];

    const deleteMutation = useMutation({
        mutationFn: () => officerService.delete(officerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["officers"] });
            router.push("/dashboard/departments");
        },
    });

    const getOfficeName = (id: string) => {
        const office = offices.find((o) => o._id === id || o.id === id);
        return office?.name || id;
    };

    const getOfficerName = (o: IOfficer): string => {
        const first = (o as unknown as { firstName?: string }).firstName;
        const last = (o as unknown as { lastName?: string }).lastName;
        if (first && last) return `${first} ${last}`;
        return o.name || o.email || "Unknown";
    };

    const getInitials = (o: IOfficer): string => {
        const first = (o as unknown as { firstName?: string }).firstName;
        const last = (o as unknown as { lastName?: string }).lastName;
        if (first && last) return `${first.charAt(0)}${last.charAt(0)}`;
        return o.name?.charAt(0)?.toUpperCase() || "?";
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="size-9 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (!officer) {
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

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/departments">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                            {getInitials(officer)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {getOfficerName(officer)}
                                </h1>
                                {officer.isAdmin && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                        <Shield className="size-3" /> Admin
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {officer.userType || "OFFICER"} • {officer.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/departments/${officerId}/edit`}>
                            <Edit className="mr-2 size-4" />
                            Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-destructive">
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete officer?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete {getOfficerName(officer)} from the system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deleteMutation.mutate()}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard icon={Mail} label="Email Address" value={officer.email} />
                <InfoCard
                    icon={Phone}
                    label="Phone Number"
                    value={officer.phone || officer.phoneNumber || "Not provided"}
                />
                <InfoCard
                    icon={QrCode}
                    label="Unique Code"
                    value={
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {officer.uniqueCode || "Not assigned"}
                        </code>
                    }
                />
                <InfoCard
                    icon={Calendar}
                    label="Tenure Start"
                    value={
                        officer.tenureStart
                            ? format(new Date(officer.tenureStart), "MMM dd, yyyy")
                            : "Not set"
                    }
                />
                <InfoCard
                    icon={Calendar}
                    label="Tenure End"
                    value={
                        officer.tenureEnd
                            ? format(new Date(officer.tenureEnd), "MMM dd, yyyy")
                            : "Ongoing"
                    }
                />
                <InfoCard
                    icon={Shield}
                    label="User Type"
                    value={
                        <span
                            className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                officer.userType === "ADMIN"
                                    ? "bg-primary/10 text-primary"
                                    : officer.userType === "GUEST"
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-blue-50 text-blue-700"
                            )}
                        >
                            {officer.userType || "OFFICER"}
                        </span>
                    }
                />
            </div>

            {/* Offices */}
            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 border-b border-border p-5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Office Assignments</h3>
                        <p className="text-xs text-muted-foreground">
                            {officer.offices?.length || 0} offices assigned
                        </p>
                    </div>
                </div>
                <div className="p-5">
                    {officer.offices && officer.offices.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {officer.offices.map((officeId) => (
                                <Link
                                    key={officeId}
                                    href={`/dashboard/offices/${officeId}`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
                                >
                                    <Building2 className="size-4 text-muted-foreground" />
                                    {getOfficeName(officeId)}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No offices assigned</p>
                    )}
                </div>
            </div>
        </div>
    );
}
