"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

export function CreateMeetingForm() {
  const router = useRouter();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState(true);

  // Fetch officers from API
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

    fetchOfficers();
  }, []);

  const getOfficerName = (officer: Officer): string => {
    if (officer.firstName && officer.lastName) {
      return `${officer.firstName} ${officer.lastName}`;
    }
    return officer.name || officer.email || "Unknown";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      expectedAttendees: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Combine date and time for startTime and endTime
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Monthly Department Meeting"
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Monthly meeting to discuss department progress and upcoming initiatives..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                      <Input
                        className="pl-9"
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
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingOfficers}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                      <SelectTrigger>
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
            <FormField
              control={form.control}
              name="expectedAttendees"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Expected Attendees</FormLabel>
                  <FormDescription>
                    Select all officers expected to attend this meeting
                  </FormDescription>
                  <div className="grid gap-3 rounded-lg border p-4 max-h-60 overflow-y-auto">
                    {loadingOfficers ? (
                      <div className="text-sm text-muted-foreground">
                        Loading officers...
                      </div>
                    ) : officers.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No officers available
                      </div>
                    ) : (
                      officers.map((officer) => (
                        <div
                          key={officer._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={officer._id}
                            checked={field.value?.includes(officer._id)}
                            onChange={(e) => {
                              const currentValues = new Set(field.value || []);
                              if (e.target.checked) {
                                currentValues.add(officer._id);
                              } else {
                                currentValues.delete(officer._id);
                              }
                              field.onChange(Array.from(currentValues));
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          />
                          <label
                            htmlFor={officer._id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {getOfficerName(officer)}
                            {officer.email && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({officer.email})
                              </span>
                            )}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <FormDescription>
                    {field.value?.length
                      ? `${field.value.length} attendee${field.value.length === 1 ? "" : "s"
                      } selected`
                      : "No attendees selected"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
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
