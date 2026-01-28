"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CalendarIcon,
    Check,
    Clock,
    MapPin,
    User,
    Users,
    FileText,
    Building2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { meetingService } from "@/app/services/meetings";
import apiClient from "@/app/services/api-client";
import { IMeeting } from "@/app/types/meetings";

interface Officer {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    offices?: string[];
}

interface Office {
    _id: string;
    name: string;
}

const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    date: z.date({ required_error: "A date is required." }),
    startTime: z.string({ required_error: "Start time is required." }),
    endTime: z.string({ required_error: "End time is required." }),
    location: z.string().min(2, { message: "Location must be at least 2 characters." }),
    organizer: z.string({ required_error: "Please select an organizer." }),
    expectedAttendees: z.array(z.string()).min(1, { message: "Please select at least one attendee." }),
    status: z.enum(["scheduled", "ongoing", "completed", "cancelled"], { required_error: "Please select a status." }),
});

interface FormSectionProps {
    title: string;
    description?: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function FormSection({ title, description, icon, children }: FormSectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

interface EditMeetingFormProps {
    meeting: IMeeting;
}

export function EditMeetingForm({ meeting }: EditMeetingFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [loadingOfficers, setLoadingOfficers] = useState(true);
    const [loadingOffices, setLoadingOffices] = useState(true);
    const [selectedOffice, setSelectedOffice] = useState<string>("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [officersRes, officesRes] = await Promise.all([
                    apiClient.get<{ data: Officer[] }>("/officers"),
                    apiClient.get<{ data: Office[] }>("/offices"),
                ]);
                setOfficers(officersRes.data.data);
                setOffices(officesRes.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoadingOfficers(false);
                setLoadingOffices(false);
            }
        };
        fetchData();
    }, []);

    const getOfficerName = (officer: Officer): string => {
        if (officer.firstName && officer.lastName) return `${officer.firstName} ${officer.lastName}`;
        return officer.name || officer.email || "Unknown";
    };

    const getInitials = (officer: Officer): string => {
        if (officer.firstName && officer.lastName) return `${officer.firstName.charAt(0)}${officer.lastName.charAt(0)}`;
        return officer.name?.charAt(0) || "?";
    };

    const getOfficeName = (officeId: string): string => {
        const office = offices.find((o) => o._id === officeId);
        return office?.name || "";
    };

    const filteredOfficers = selectedOffice === "all"
        ? officers
        : officers.filter((officer) => officer.offices?.includes(selectedOffice));

    // Parse meeting data for form defaults
    const meetingDate = meeting.date ? new Date(meeting.date) : new Date();
    const startTimeStr = meeting.startTime ? format(new Date(meeting.startTime), "HH:mm") : "09:00";
    const endTimeStr = meeting.endTime ? format(new Date(meeting.endTime), "HH:mm") : "10:00";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: meeting.title || "",
            description: meeting.description || "",
            date: meetingDate,
            startTime: startTimeStr,
            endTime: endTimeStr,
            location: meeting.location || "",
            organizer: meeting.organizer || "",
            expectedAttendees: meeting.expectedAttendees || [],
            status: meeting.status || "scheduled",
        },
    });

    const selectedAttendees = form.watch("expectedAttendees");

    const handleSelectAll = () => {
        const allFilteredIds = filteredOfficers.map((o) => o._id);
        const currentSelected = new Set(selectedAttendees);
        allFilteredIds.forEach((id) => currentSelected.add(id));
        form.setValue("expectedAttendees", Array.from(currentSelected));
    };

    const handleDeselectAll = () => {
        if (selectedOffice === "all") {
            form.setValue("expectedAttendees", []);
        } else {
            const filteredIds = new Set(filteredOfficers.map((o) => o._id));
            const remaining = selectedAttendees.filter((id) => !filteredIds.has(id));
            form.setValue("expectedAttendees", remaining);
        }
    };

    const allFilteredSelected = filteredOfficers.length > 0 && filteredOfficers.every((o) => selectedAttendees.includes(o._id));

    const updateMutation = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const startTime = new Date(
                data.date.getFullYear(),
                data.date.getMonth(),
                data.date.getDate(),
                Number(data.startTime.split(":")[0]),
                Number(data.startTime.split(":")[1])
            ).toISOString();

            const endTime = new Date(
                data.date.getFullYear(),
                data.date.getMonth(),
                data.date.getDate(),
                Number(data.endTime.split(":")[0]),
                Number(data.endTime.split(":")[1])
            ).toISOString();

            return meetingService.update(meeting.id, {
                title: data.title,
                description: data.description,
                date: data.date.toISOString(),
                startTime,
                endTime,
                location: data.location,
                organizer: data.organizer,
                expectedAttendees: data.expectedAttendees,
                status: data.status,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            queryClient.invalidateQueries({ queryKey: ["meeting", meeting.id] });
            router.push(`/dashboard/meetings/${meeting.id}`);
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
                {/* Meeting Details */}
                <FormSection title="Meeting Details" description="Update basic information" icon={<FileText className="size-4" />}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Meeting title" className="bg-muted" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Meeting description" className="min-h-[100px] resize-none bg-muted" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </FormSection>

                {/* Date & Time */}
                <FormSection title="Date & Time" description="Schedule details" icon={<Clock className="size-4" />}>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full bg-muted pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "MMM dd, yyyy") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="startTime" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl><Input type="time" className="bg-muted" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="endTime" render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl><Input type="time" className="bg-muted" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </FormSection>

                {/* Location & Status */}
                <FormSection title="Location & Status" icon={<MapPin className="size-4" />}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input className="bg-muted pl-9" placeholder="Meeting location" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-muted"><SelectValue placeholder="Select status" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </FormSection>

                {/* Organizer */}
                <FormSection title="Organizer" icon={<User className="size-4" />}>
                    <FormField control={form.control} name="organizer" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Organizer</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={loadingOfficers}>
                                <FormControl>
                                    <SelectTrigger className="bg-muted">
                                        <SelectValue placeholder={loadingOfficers ? "Loading..." : "Select organizer"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {officers.map((officer) => (
                                        <SelectItem key={officer._id} value={officer._id}>{getOfficerName(officer)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </FormSection>

                {/* Attendees */}
                <FormSection title="Expected Attendees" icon={<Users className="size-4" />}>
                    <FormField control={form.control} name="expectedAttendees" render={({ field }) => (
                        <FormItem>
                            <div className="mb-4 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Building2 className="size-4 text-muted-foreground" />
                                    <Select value={selectedOffice} onValueChange={setSelectedOffice} disabled={loadingOffices}>
                                        <SelectTrigger className="h-8 w-[180px] bg-muted text-sm">
                                            <SelectValue placeholder="Filter by office" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Officers</SelectItem>
                                            {offices.map((office) => (
                                                <SelectItem key={office._id} value={office._id}>{office.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={handleSelectAll} disabled={allFilteredSelected} className="h-8 text-xs">
                                        <Check className="mr-1 size-3" />Select All
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={handleDeselectAll} disabled={selectedAttendees.length === 0} className="h-8 text-xs">
                                        Clear
                                    </Button>
                                </div>
                            </div>
                            <div className="mb-3 flex items-center justify-between">
                                <FormLabel className="text-sm">{filteredOfficers.length} officers</FormLabel>
                                <span className="text-xs font-medium text-primary">{field.value?.length || 0} selected</span>
                            </div>
                            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-muted p-2">
                                {loadingOfficers ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
                                ) : filteredOfficers.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">No officers</div>
                                ) : (
                                    filteredOfficers.map((officer) => (
                                        <label key={officer._id} className={cn("flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors", field.value?.includes(officer._id) ? "bg-primary/10" : "hover:bg-card")}>
                                            <Checkbox checked={field.value?.includes(officer._id)} onCheckedChange={(checked) => {
                                                const vals = new Set(field.value || []);
                                                checked ? vals.add(officer._id) : vals.delete(officer._id);
                                                field.onChange(Array.from(vals));
                                            }} />
                                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{getInitials(officer)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{getOfficerName(officer)}</p>
                                                <p className="truncate text-xs text-muted-foreground">{officer.email}</p>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                </FormSection>

                {/* Actions */}
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
