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
  officers?: string[];
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  startTime: z.string({
    required_error: "Start time is required.",
  }),
  endTime: z.string({
    required_error: "End time is required.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  organizer: z.string({
    required_error: "Please select an organizer.",
  }),
  expectedAttendees: z.array(z.string()).min(1, {
    message: "Please select at least one attendee.",
  }),
  status: z.enum(["scheduled", "ongoing", "completed", "cancelled"], {
    required_error: "Please select a status.",
  }),
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
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function CreateMeetingForm() {
  const router = useRouter();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<string>("all");

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await apiClient.get<{ data: Officer[] }>("/officers");
        setOfficers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch officers:", error);
      } finally {
        setLoadingOfficers(false);
      }
    };

    const fetchOffices = async () => {
      try {
        const response = await apiClient.get<{ data: Office[] }>("/offices");
        setOffices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch offices:", error);
      } finally {
        setLoadingOffices(false);
      }
    };

    fetchOfficers();
    fetchOffices();
  }, []);

  const getOfficerName = (officer: Officer): string => {
    if (officer.firstName && officer.lastName) {
      return `${officer.firstName} ${officer.lastName}`;
    }
    return officer.name || officer.email || "Unknown";
  };

  const getInitials = (officer: Officer): string => {
    if (officer.firstName && officer.lastName) {
      return `${officer.firstName.charAt(0)}${officer.lastName.charAt(0)}`;
    }
    return officer.name?.charAt(0) || "?";
  };

  const getOfficeName = (officeId: string): string => {
    const office = offices.find((o) => o._id === officeId);
    return office?.name || "";
  };

  // Filter officers by selected office
  const filteredOfficers =
    selectedOffice === "all"
      ? officers
      : officers.filter((officer) =>
        officer.offices?.includes(selectedOffice)
      );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      expectedAttendees: [],
      status: "scheduled",
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

  const handleSelectByOffice = (officeId: string) => {
    const officeOfficers = officers.filter((o) => o.offices?.includes(officeId));
    const officeOfficerIds = officeOfficers.map((o) => o._id);
    const currentSelected = new Set(selectedAttendees);
    officeOfficerIds.forEach((id) => currentSelected.add(id));
    form.setValue("expectedAttendees", Array.from(currentSelected));
  };

  const allFilteredSelected =
    filteredOfficers.length > 0 &&
    filteredOfficers.every((o) => selectedAttendees.includes(o._id));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const startTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        Number(values.startTime.split(":")[0]),
        Number(values.startTime.split(":")[1])
      ).toISOString();

      const endTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        Number(values.endTime.split(":")[0]),
        Number(values.endTime.split(":")[1])
      ).toISOString();

      await meetingService.create({
        title: values.title,
        description: values.description,
        date: values.date.toISOString(),
        startTime,
        endTime,
        location: values.location,
        organizer: values.organizer,
        expectedAttendees: values.expectedAttendees,
        status: values.status,
      });
      router.push("/dashboard/meetings");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Meeting Details Section */}
        <FormSection
          title="Meeting Details"
          description="Basic information about the meeting"
          icon={<FileText className="size-4" />}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Monthly Department Meeting"
                      className="bg-muted"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Monthly meeting to discuss department progress..."
                      className="min-h-[100px] resize-none bg-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Date & Time Section */}
        <FormSection
          title="Date & Time"
          description="When will this meeting take place"
          icon={<Clock className="size-4" />}
        >
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
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full bg-muted pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MMM dd, yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" className="bg-muted" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" className="bg-muted" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Location & Status Section */}
        <FormSection
          title="Location & Status"
          description="Where and current status"
          icon={<MapPin className="size-4" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="bg-muted pl-9"
                        placeholder="Meeting Room 1"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-muted">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
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
              )}
            />
          </div>
        </FormSection>

        {/* Organizer Section */}
        <FormSection
          title="Organizer"
          description="Who is responsible for this meeting"
          icon={<User className="size-4" />}
        >
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Organizer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loadingOfficers}
                >
                  <FormControl>
                    <SelectTrigger className="bg-muted">
                      <SelectValue
                        placeholder={
                          loadingOfficers ? "Loading..." : "Select organizer"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {officers.map((officer) => (
                      <SelectItem key={officer._id} value={officer._id}>
                        {getOfficerName(officer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The officer responsible for organizing this meeting
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Attendees Section */}
        <FormSection
          title="Expected Attendees"
          description="Select officers expected to attend"
          icon={<Users className="size-4" />}
        >
          <FormField
            control={form.control}
            name="expectedAttendees"
            render={({ field }) => (
              <FormItem>
                {/* Filter and Actions Row */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {/* Filter by Office */}
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <Select
                      value={selectedOffice}
                      onValueChange={setSelectedOffice}
                      disabled={loadingOffices}
                    >
                      <SelectTrigger className="h-8 w-[180px] bg-muted text-sm">
                        <SelectValue placeholder="Filter by office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Officers</SelectItem>
                        {offices.map((office) => (
                          <SelectItem key={office._id} value={office._id}>
                            {office.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      disabled={allFilteredSelected}
                      className="h-8 text-xs"
                    >
                      <Check className="mr-1 size-3" />
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      disabled={selectedAttendees.length === 0}
                      className="h-8 text-xs"
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Quick Office Selects */}
                  {offices.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {offices.slice(0, 4).map((office) => (
                        <button
                          key={office._id}
                          type="button"
                          onClick={() => handleSelectByOffice(office._id)}
                          className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          + {office.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selection Count */}
                <div className="mb-3 flex items-center justify-between">
                  <FormLabel className="text-sm">
                    {selectedOffice !== "all" && (
                      <span className="text-primary">
                        {getOfficeName(selectedOffice)} •{" "}
                      </span>
                    )}
                    {filteredOfficers.length} officer
                    {filteredOfficers.length !== 1 ? "s" : ""}
                  </FormLabel>
                  <span className="text-xs font-medium text-primary">
                    {field.value?.length || 0} selected
                  </span>
                </div>

                {/* Officer List */}
                <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-muted p-2">
                  {loadingOfficers ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading officers...
                    </div>
                  ) : filteredOfficers.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      {selectedOffice !== "all"
                        ? "No officers in this office"
                        : "No officers available"}
                    </div>
                  ) : (
                    filteredOfficers.map((officer) => (
                      <label
                        key={officer._id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors duration-150",
                          field.value?.includes(officer._id)
                            ? "bg-primary/10"
                            : "hover:bg-card"
                        )}
                      >
                        <Checkbox
                          checked={field.value?.includes(officer._id)}
                          onCheckedChange={(checked) => {
                            const currentValues = new Set(field.value || []);
                            if (checked) {
                              currentValues.add(officer._id);
                            } else {
                              currentValues.delete(officer._id);
                            }
                            field.onChange(Array.from(currentValues));
                          }}
                        />
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {getInitials(officer)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {getOfficerName(officer)}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {officer.email}
                            {officer.offices && officer.offices.length > 0 && (
                              <span className="ml-1">
                                • {officer.offices.map(getOfficeName).filter(Boolean).join(", ")}
                              </span>
                            )}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Meeting"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
