"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    MoreHorizontal,
    Search,
    Eye,
    Edit,
    Trash2,
    Shield,
    Mail,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { officerService } from "@/app/services/officer";
import { officeService } from "@/app/services/office";
import { IOfficer } from "@/app/types/officer";
import { cn } from "@/lib/utils";

export function OfficerTable() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = React.useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [officerToDelete, setOfficerToDelete] = React.useState<IOfficer | null>(null);

    const { data: officers = [], isLoading } = useQuery({
        queryKey: ["officers"],
        queryFn: () => officerService.getAll(),
        staleTime: 60000,
    });

    const { data: officesData } = useQuery({
        queryKey: ["offices"],
        queryFn: () => officeService.getAll({ page: 1, limit: 100 }),
        staleTime: 60000,
    });
    const offices = officesData?.data ?? [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => officerService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["officers"] });
            setDeleteDialogOpen(false);
            setOfficerToDelete(null);
        },
    });

    const getOfficeName = (id: string) => {
        const office = offices.find((o) => o._id === id);
        return office?.name || "";
    };

    const getOfficerName = (officer: IOfficer): string => {
        const first = (officer as unknown as { firstName?: string }).firstName;
        const last = (officer as unknown as { lastName?: string }).lastName;
        if (first && last) return `${first} ${last}`;
        return officer.name || officer.email || "Unknown";
    };

    const getInitials = (officer: IOfficer): string => {
        const first = (officer as unknown as { firstName?: string }).firstName;
        const last = (officer as unknown as { lastName?: string }).lastName;
        if (first && last) return `${first.charAt(0)}${last.charAt(0)}`;
        return officer.name?.charAt(0)?.toUpperCase() || "?";
    };

    const filteredOfficers = officers.filter((officer) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        const name = getOfficerName(officer).toLowerCase();
        return (
            name.includes(searchLower) ||
            officer.email?.toLowerCase().includes(searchLower) ||
            officer.uniqueCode?.toLowerCase().includes(searchLower)
        );
    });

    const handleView = (id: string) => router.push(`/dashboard/departments/${id}`);
    const handleEdit = (id: string) => router.push(`/dashboard/departments/${id}/edit`);
    const handleDeleteClick = (officer: IOfficer) => {
        setOfficerToDelete(officer);
        setDeleteDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="size-10 rounded-full" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search officers by name, email, or code..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Officer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Unique Code</TableHead>
                                <TableHead>Offices</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOfficers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="text-muted-foreground">No officers found</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOfficers.map((officer) => (
                                    <TableRow key={officer._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                                    {getInitials(officer)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{getOfficerName(officer)}</p>
                                                    {officer.isAdmin && (
                                                        <span className="inline-flex items-center gap-1 text-xs text-primary">
                                                            <Shield className="size-3" /> Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5 text-sm">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Mail className="size-3" />
                                                    {officer.email}
                                                </div>
                                                {(officer.phone || officer.phoneNumber) && (
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Phone className="size-3" />
                                                        {officer.phone || officer.phoneNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                                                {officer.uniqueCode || "—"}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {officer.offices?.slice(0, 2).map((officeId) => (
                                                    <span
                                                        key={officeId}
                                                        className="inline-flex rounded bg-muted px-2 py-0.5 text-xs"
                                                    >
                                                        {getOfficeName(officeId) || "Office"}
                                                    </span>
                                                ))}
                                                {(officer.offices?.length || 0) > 2 && (
                                                    <span className="inline-flex rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                        +{officer.offices!.length - 2}
                                                    </span>
                                                )}
                                                {!officer.offices?.length && (
                                                    <span className="text-xs text-muted-foreground">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleView(officer._id)}>
                                                        <Eye className="mr-2 size-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEdit(officer._id)}>
                                                        <Edit className="mr-2 size-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(officer)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm text-muted-foreground">
                    Showing {filteredOfficers.length} of {officers.length} officers
                </p>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete officer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            {officerToDelete && getOfficerName(officerToDelete)} from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => officerToDelete && deleteMutation.mutate(officerToDelete._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
