"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Users, Shield, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { officerService } from "@/app/services/officer";
import { OfficerTable } from "./officer-table";

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export default function OfficersDashboard() {
    const { data: officers = [] } = useQuery({
        queryKey: ["officers"],
        queryFn: () => officerService.getAll(),
        staleTime: 60000,
    });

    const adminCount = officers.filter((o) => o.isAdmin).length;
    const activeCount = officers.filter((o) => {
        if (!o.tenureEnd) return true;
        return new Date(o.tenureEnd) > new Date();
    }).length;

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Officers</h1>
                    <p className="text-muted-foreground">
                        Manage officers, their roles, and office assignments.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/departments/create">
                        <Plus className="mr-2 size-4" />
                        Add Officer
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Officers"
                    value={officers.length}
                    description="Registered in system"
                    icon={Users}
                />
                <StatCard
                    title="Administrators"
                    value={adminCount}
                    description="With admin privileges"
                    icon={Shield}
                />
                <StatCard
                    title="Active Officers"
                    value={activeCount}
                    description="Currently serving"
                    icon={UserCheck}
                />
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Officers</CardTitle>
                    <CardDescription>
                        View and manage all registered officers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <OfficerTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
