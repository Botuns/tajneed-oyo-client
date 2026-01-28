"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Building2, Mail, FileText, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { officeService } from "@/app/services/office";
import { IOffice } from "@/app/types/office";

const formSchema = z.object({
    name: z.string().min(2, { message: "Office name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    responsibilities: z.array(
        z.object({
            value: z.string().min(1, { message: "Responsibility cannot be empty." }),
        })
    ).min(1, { message: "Please add at least one responsibility." }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function FormSection({ title, icon, children }: FormSectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

interface EditOfficeFormProps {
    office: IOffice;
}

export function EditOfficeForm({ office }: EditOfficeFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: office.name || "",
            email: office.email || "",
            description: office.description || "",
            responsibilities: office.responsibilities?.map((r) => ({ value: r })) || [{ value: "" }],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        name: "responsibilities",
        control: form.control,
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormValues) =>
            officeService.update(office._id, {
                name: data.name,
                email: data.email,
                description: data.description,
                responsibilities: data.responsibilities.map((r) => r.value),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offices"] });
            queryClient.invalidateQueries({ queryKey: ["office", office._id] });
            router.push(`/dashboard/offices/${office._id}`);
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
                {/* Basic Info */}
                <FormSection title="Basic Information" icon={<Building2 className="size-4" />}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter office name" className="bg-muted" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                placeholder="office@example.com"
                                                className="bg-muted pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </FormSection>

                {/* Description */}
                <FormSection title="Description" icon={<FileText className="size-4" />}>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Office Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the office's purpose and function"
                                        className="min-h-[100px] resize-none bg-muted"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                {/* Responsibilities */}
                <FormSection title="Responsibilities" icon={<ListChecks className="size-4" />}>
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <FormField
                                control={form.control}
                                key={field.id}
                                name={`responsibilities.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Enter responsibility"
                                                    className="bg-muted"
                                                    {...field}
                                                />
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ value: "" })}
                            className="w-full"
                        >
                            <Plus className="mr-2 size-4" />
                            Add Responsibility
                        </Button>
                    </div>
                    {form.formState.errors.responsibilities?.root && (
                        <p className="mt-2 text-sm text-destructive">
                            {form.formState.errors.responsibilities.root.message}
                        </p>
                    )}
                </FormSection>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
