"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Building2,
    Edit,
    Mail,
    Trash2,
    Users,
    AlertCircle,
    Plus,
    ListChecks,
} from "lucide-react";

import { officeService } from "@/app/services/office";
import { officerService } from "@/app/services/officer";
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

function InfoCard({
    icon: Icon,
    label,
    value,
    className,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-3 rounded-lg border border-border bg-card p-4", className)}>
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
        </div>
    );
}

export default function OfficeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const officeId = params.id as string;

    const { data: office, isLoading } = useQuery({
        queryKey: ["office", officeId],
        queryFn: () => officeService.getById(officeId),
        enabled: !!officeId,
    });

    const { data: allOfficers = [] } = useQuery({
        queryKey: ["officers"],
        queryFn: () => officerService.getAll(),
        staleTime: 60000,
    });

    const deleteMutation = useMutation({
        mutationFn: () => officeService.delete(officeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offices"] });
            router.push("/dashboard/offices");
        },
    });

    const getOfficerName = (id: string) => {
        const officer = allOfficers.find((o) => o._id === id);
        if (officer) {
            const firstName = (officer as { firstName?: string }).firstName;
            const lastName = (officer as { lastName?: string }).lastName;
            if (firstName && lastName) return `${firstName} ${lastName}`;
            return (officer as { name?: string }).name || officer.email || id;
        }
        return id.length > 12 ? `${id.slice(0, 8)}...` : id;
    };

    const getOfficerEmail = (id: string) => {
        const officer = allOfficers.find((o) => o._id === id);
        return officer?.email || "";
    };

    const getInitials = (id: string) => {
        const officer = allOfficers.find((o) => o._id === id);
        if (officer) {
            const firstName = (officer as { firstName?: string }).firstName;
            const lastName = (officer as { lastName?: string }).lastName;
            if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`;
        }
        return "?";
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="size-9 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (!office) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="mb-4 size-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Office not found</h2>
                <p className="text-sm text-muted-foreground">This office may have been deleted.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/offices">Back to Offices</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/offices">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{office.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{office.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/offices/${officeId}/edit`}>
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
                                <AlertDialogTitle>Delete office?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    office &ldquo;{office.name}&rdquo; and remove all officer assignments.
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
                <InfoCard icon={Mail} label="Email" value={office.email} />
                <InfoCard icon={Users} label="Total Officers" value={office.totalOfficers || office.officers?.length || 0} />
                <InfoCard icon={ListChecks} label="Responsibilities" value={`${office.responsibilities?.length || 0} defined`} />
            </div>

            {/* Responsibilities */}
            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 border-b border-border p-5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                        <ListChecks className="size-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold">Responsibilities</h3>
                </div>
                <div className="p-5">
                    {office.responsibilities && office.responsibilities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {office.responsibilities.map((resp, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                                >
                                    {resp}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No responsibilities defined</p>
                    )}
                </div>
            </div>

            {/* Officers */}
            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                            <Users className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">Officers</h3>
                            <p className="text-xs text-muted-foreground">
                                {office.officers?.length || 0} officers assigned
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 size-3" />
                        Add Officer
                    </Button>
                </div>
                <div className="divide-y divide-border">
                    {office.officers && office.officers.length > 0 ? (
                        office.officers.map((officerId: string) => (
                            <div key={officerId} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                        {getInitials(officerId)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{getOfficerName(officerId)}</p>
                                        <p className="text-xs text-muted-foreground">{getOfficerEmail(officerId)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No officers assigned to this office
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
