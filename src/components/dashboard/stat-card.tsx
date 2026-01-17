"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    highlighted?: boolean;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    highlighted = false,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 rounded-xl border bg-card p-5 transition-colors duration-150",
                highlighted
                    ? "border-primary bg-[hsl(var(--primary)/0.08)]"
                    : "border-border"
            )}
        >
            <div
                className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg",
                    highlighted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                )}
            >
                <Icon className="size-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">{title}</p>
                <p className="stat-number mt-1 text-foreground">{value}</p>
                {subtitle && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

interface DualStatCardProps {
    leftStat: {
        label: string;
        value: string | number;
        sublabel?: string;
    };
    rightStat: {
        label: string;
        value: string | number;
        sublabel?: string;
    };
    icon: LucideIcon;
    highlighted?: boolean;
}

export function DualStatCard({
    leftStat,
    rightStat,
    icon: Icon,
    highlighted = false,
}: DualStatCardProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 rounded-xl border bg-card p-5 transition-colors duration-150",
                highlighted
                    ? "border-primary bg-[hsl(var(--primary)/0.08)]"
                    : "border-border"
            )}
        >
            <div
                className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg",
                    highlighted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                )}
            >
                <Icon className="size-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-1 items-center gap-6">
                <div className="min-w-0">
                    <p className="stat-number text-foreground">{leftStat.value}</p>
                    <p className="text-xs text-muted-foreground">{leftStat.label}</p>
                    {leftStat.sublabel && (
                        <p className="text-[10px] text-muted-foreground/70">{leftStat.sublabel}</p>
                    )}
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="min-w-0">
                    <p className="stat-number text-foreground">{rightStat.value}</p>
                    <p className="text-xs text-muted-foreground">{rightStat.label}</p>
                    {rightStat.sublabel && (
                        <p className="text-[10px] text-muted-foreground/70">{rightStat.sublabel}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="size-11 shrink-0 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}
