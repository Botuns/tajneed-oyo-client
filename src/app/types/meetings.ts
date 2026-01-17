export interface ICreateMeetingDto {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  expectedAttendees?: string[];
  status?: MeetingStatus;
}

export interface IUpdateMeetingDto {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  organizer?: string;
  expectedAttendees?: string[];
  status?: MeetingStatus;
}

export type MeetingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

export interface IMeeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  time: string;
  location: string;
  attendees: number;
  organizer: string;
  expectedAttendees?: string[];
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingFilters {
  page?: number;
  limit?: number;
  status?: MeetingStatus;
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