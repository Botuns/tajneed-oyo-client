import {
  ICreateMeetingDto,
  IMeeting,
  MeetingFilters,
  MeetingsResponse,
} from "../types/meetings";
import apiClient from "./api-client";

export const meetingService = {
  create: async (data: ICreateMeetingDto): Promise<IMeeting> => {
    try {
      const response = await apiClient.post<IMeeting>("/meetings", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAll: async (filters: MeetingFilters): Promise<MeetingsResponse> => {
    try {
      const response = await apiClient.get<MeetingsResponse>("/meetings", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
