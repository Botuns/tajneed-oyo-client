"use client";

import * as React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { ThreeMonthAbsence } from "@/app/types/attendance";

interface AbsenceAlertsProps {
    absences: ThreeMonthAbsence[];
    isLoading?: boolean;
}

export function AbsenceAlerts({ absences, isLoading }: AbsenceAlertsProps) {
    if (isLoading) {
        return <AbsenceAlertsSkeleton />;
    }

    if (absences.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-amber-200 bg-amber-50">
            <div className="flex items-center gap-3 border-b border-amber-200 p-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100">
                    <AlertTriangle className="size-4 text-amber-600" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-amber-900">
                        Attention Required
                    </h3>
                    <p className="text-xs text-amber-700">
                        {absences.length} officer{absences.length > 1 ? "s" : ""} with 3+
                        consecutive month absences
                    </p>
                </div>
            </div>
            <div className="divide-y divide-amber-200">
                {absences.slice(0, 5).map((absence) => (
                    <div
                        key={absence.officer._id}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-amber-100/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-700">
                                {absence.officer.firstName.charAt(0)}
                                {absence.officer.lastName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-900">
                                    {absence.officer.firstName} {absence.officer.lastName}
                                </p>
                                <p className="text-xs text-amber-700">
                                    Absent: {absence.months?.join(", ") || `${absence.consecutiveAbsences} months`}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="size-4 text-amber-400" />
                    </div>
                ))}
            </div>
            {absences.length > 5 && (
                <div className="border-t border-amber-200 p-3 text-center">
                    <span className="text-xs font-medium text-amber-700">
                        +{absences.length - 5} more officers
                    </span>
                </div>
            )}
        </div>
    );
}

export function AbsenceAlertsSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
                <div className="size-8 animate-pulse rounded-lg bg-muted" />
                <div className="space-y-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}
