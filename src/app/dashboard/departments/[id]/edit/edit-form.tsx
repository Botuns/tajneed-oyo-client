"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { User, Mail, Phone, Calendar, Building2, Shield, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { officerService } from "@/app/services/officer";
import { officeService } from "@/app/services/office";
import { IOfficer, UserType } from "@/app/types/officer";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name is required." }),
    lastName: z.string().min(2, { message: "Last name is required." }),
    email: z.string().email({ message: "Valid email is required." }),
    phoneNumber: z.string().min(10, { message: "Valid phone number is required." }),
    userType: z.nativeEnum(UserType),
    isAdmin: z.boolean(),
    offices: z.array(z.string()),
    tenureStart: z.date({ required_error: "Tenure start is required." }),
    tenureEnd: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">{icon}</div>
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

export function EditOfficerForm({ officer }: { officer: IOfficer }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: officesData } = useQuery({
        queryKey: ["offices"],
        queryFn: () => officeService.getAll({ page: 1, limit: 100 }),
        staleTime: 60000,
    });
    const offices = officesData?.data ?? [];

    const firstName = (officer as unknown as { firstName?: string }).firstName || "";
    const lastName = (officer as unknown as { lastName?: string }).lastName || "";

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName,
            lastName,
            email: officer.email || "",
            phoneNumber: officer.phone || officer.phoneNumber || "",
            userType: officer.userType || UserType.OFFICER,
            isAdmin: officer.isAdmin || false,
            offices: officer.offices || [],
            tenureStart: officer.tenureStart ? new Date(officer.tenureStart) : new Date(),
            tenureEnd: officer.tenureEnd ? new Date(officer.tenureEnd) : undefined,
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormValues) =>
            officerService.update(officer._id, {
                ...data,
                tenureStart: data.tenureStart,
                tenureEnd: data.tenureEnd,
            } as Partial<IOfficer>),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["officers"] });
            queryClient.invalidateQueries({ queryKey: ["officer", officer._id] });
            router.push(`/dashboard/departments/${officer._id}`);
        },
    });

    const selectedOffices = form.watch("offices");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
                <FormSection title="Personal Information" icon={<User className="size-4" />}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl><Input placeholder="John" className="bg-muted" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl><Input placeholder="Doe" className="bg-muted" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </FormSection>

                <FormSection title="Contact Details" icon={<Mail className="size-4" />}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="email" className="bg-muted pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input type="tel" className="bg-muted pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </FormSection>

                <FormSection title="Role & Permissions" icon={<Shield className="size-4" />}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="userType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-muted"><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={UserType.OFFICER}>Officer</SelectItem>
                                        <SelectItem value={UserType.GUEST}>Guest</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isAdmin" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Administrator</FormLabel>
                                    <FormDescription>Grant admin privileges</FormDescription>
                                </div>
                            </FormItem>
                        )} />
                    </div>
                </FormSection>

                <FormSection title="Tenure Period" icon={<Calendar className="size-4" />}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="tenureStart" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full bg-muted pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : "Pick date"}
                                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarPicker mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="tenureEnd" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date (Optional)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full bg-muted pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : "Ongoing"}
                                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarPicker mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </FormSection>

                <FormSection title="Office Assignments" icon={<Building2 className="size-4" />}>
                    <FormField control={form.control} name="offices" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{selectedOffices.length} offices selected</FormLabel>
                            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted p-2">
                                {offices.map((office) => (
                                    <label key={office._id} className={cn("flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors", field.value?.includes(office._id) ? "bg-primary/10" : "hover:bg-card")}>
                                        <Checkbox
                                            checked={field.value?.includes(office._id)}
                                            onCheckedChange={(checked) => {
                                                const vals = new Set(field.value || []);
                                                checked ? vals.add(office._id) : vals.delete(office._id);
                                                field.onChange(Array.from(vals));
                                            }}
                                        />
                                        <span className="text-sm font-medium">{office.name}</span>
                                    </label>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                </FormSection>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
