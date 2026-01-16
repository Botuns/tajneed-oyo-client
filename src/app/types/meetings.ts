// app/types/meeting.ts
export interface ICreateMeetingDto {
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees?: number;
  description?: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
}

export interface IUpdateMeetingDto {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  organizer?: string;
  attendees?: number;
  description?: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
}

export interface IMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  organizer: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingFilters {
  page: number;
  limit: number;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface MeetingsResponse {
  data: IMeeting[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}