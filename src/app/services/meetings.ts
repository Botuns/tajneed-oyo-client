import {
  ICreateMeetingDto,
  IMeeting,
  MeetingFilters,
  MeetingsResponse,
} from "../types/meetings";
import apiClient from "./api-client";

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export const meetingService = {
  create: async (data: ICreateMeetingDto): Promise<IMeeting> => {
    const response = await apiClient.post<ApiResponse<IMeeting>>(
      "/meetings",
      data
    );
    return response.data.data;
  },

  getAll: async (filters?: MeetingFilters): Promise<MeetingsResponse> => {
    const response = await apiClient.get<MeetingsResponse>("/meetings", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<IMeeting> => {
    const response = await apiClient.get<ApiResponse<IMeeting>>(
      `/meetings/${id}`
    );
    return response.data.data;
  },

  getUpcoming: async (): Promise<IMeeting[]> => {
    const response = await apiClient.get<ApiResponse<IMeeting[]>>(
      "/meetings/upcoming"
    );
    return response.data.data;
  },

  update: async (
    id: string,
    data: Partial<ICreateMeetingDto>
  ): Promise<IMeeting> => {
    const response = await apiClient.patch<ApiResponse<IMeeting>>(
      `/meetings/${id}`,
      data
    );
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: IMeeting["status"]
  ): Promise<IMeeting> => {
    const response = await apiClient.patch<ApiResponse<IMeeting>>(
      `/meetings/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/meetings/${id}`);
  },
};
