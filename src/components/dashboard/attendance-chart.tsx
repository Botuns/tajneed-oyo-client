"use client";

import * as React from "react";
import Link from "next/link";

interface AttendanceChartProps {
    data?: {
        month: string;
        rate: number;
    }[];
}

const DEFAULT_DATA = [
    { month: "Jan", rate: 85 },
    { month: "Feb", rate: 78 },
    { month: "Mar", rate: 92 },
    { month: "Apr", rate: 88 },
    { month: "May", rate: 95 },
    { month: "Jun", rate: 82 },
];

export function AttendanceChart({ data = DEFAULT_DATA }: AttendanceChartProps) {
    const maxRate = 100;
    const average = Math.round(data.reduce((a, b) => a + b.rate, 0) / data.length);

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="section-header">Performance Overview</h3>
                <Link
                    href="/dashboard/reports"
                    className="text-xs font-medium text-primary hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* Chart Area */}
            <div className="relative h-48">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-[10px] text-muted-foreground">
                    <span>10</span>
                    <span>8</span>
                    <span>6</span>
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                </div>

                {/* Bars */}
                <div className="ml-6 flex h-full items-end gap-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-2">
                            <div
                                className="w-full max-w-10 rounded-t bg-primary/20 transition-all duration-200 hover:bg-primary/30"
                                style={{
                                    height: `${(item.rate / maxRate) * 100}%`,
                                    minHeight: "8px",
                                }}
                            >
                                <div
                                    className="w-full rounded-t bg-primary"
                                    style={{ height: `${(item.rate / (item.rate || 1)) * item.rate}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* X-axis labels */}
            <div className="ml-6 mt-2 flex gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 text-center text-[10px] text-muted-foreground">
                        {item.month}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-sm bg-primary" />
                        <span className="text-xs text-muted-foreground">Attendance</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-sm bg-primary/30" />
                        <span className="text-xs text-muted-foreground">Expected</span>
                    </div>
                </div>
                <span className="text-xs font-medium">Avg: {average}%</span>
            </div>
        </div>
    );
}

export function AttendanceChartSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex h-48 items-end gap-4 pl-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <div
                            className="w-full max-w-10 animate-pulse rounded-t bg-muted"
                            style={{ height: `${30 + Math.random() * 60}%` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
