import {
  AttendanceStats,
  IAttendance,
  ICheckInGuestDto,
  MeetingAttendanceBreakdown,
  MeetingStatsBreakdown,
  ThreeMonthAbsence,
} from "../types/attendance";
import apiClient from "./api-client";

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export const attendanceService = {
  getByMeeting: async (meetingId: string): Promise<IAttendance[]> => {
    const response = await apiClient.get<ApiResponse<IAttendance[]>>(
      `/attendance/meeting/${meetingId}`
    );
    return response.data.data;
  },

  getStats: async (meetingId: string): Promise<AttendanceStats> => {
    const response = await apiClient.get<ApiResponse<AttendanceStats>>(
      `/attendance/meeting/${meetingId}/stats`
    );
    return response.data.data;
  },

  getOfficerHistory: async (officerId: string): Promise<IAttendance[]> => {
    const response = await apiClient.get<ApiResponse<IAttendance[]>>(
      `/attendance/officer/${officerId}/history`
    );
    return response.data.data;
  },

  getThreeMonthAbsences: async (): Promise<ThreeMonthAbsence[]> => {
    const response = await apiClient.get<ApiResponse<ThreeMonthAbsence[]>>(
      "/attendance/absent/three-months"
    );
    return response.data.data;
  },

  checkInByCode: async (
    meetingId: string,
    uniqueCode: string
  ): Promise<IAttendance> => {
    const response = await apiClient.post<ApiResponse<IAttendance>>(
      "/attendance/checkin/unique-code",
      { meetingId, uniqueCode }
    );
    return response.data.data;
  },

  // Check in a mulk member (an officer with isMulk === true) by unique code.
  // The backend rejects codes that belong to a non-mulk officer.
  checkInMulkByCode: async (
    meetingId: string,
    uniqueCode: string
  ): Promise<IAttendance> => {
    const response = await apiClient.post<ApiResponse<IAttendance>>(
      "/attendance/checkin/mulk/unique-code",
      { meetingId, uniqueCode }
    );
    return response.data.data;
  },

  // Walk-in guest check-in. Creates the guest record inline.
  checkInGuest: async (dto: ICheckInGuestDto): Promise<IAttendance> => {
    const response = await apiClient.post<ApiResponse<IAttendance>>(
      "/attendance/checkin/guest",
      dto
    );
    return response.data.data;
  },

  getMeetingBreakdown: async (
    meetingId: string
  ): Promise<MeetingAttendanceBreakdown> => {
    const response = await apiClient.get<ApiResponse<MeetingAttendanceBreakdown>>(
      `/attendance/meeting/${meetingId}/breakdown`
    );
    return response.data.data;
  },

  getMeetingStatsBreakdown: async (
    meetingId: string
  ): Promise<MeetingStatsBreakdown> => {
    const response = await apiClient.get<ApiResponse<MeetingStatsBreakdown>>(
      `/attendance/meeting/${meetingId}/stats/breakdown`
    );
    return response.data.data;
  },

  checkout: async (attendanceId: string): Promise<IAttendance> => {
    const response = await apiClient.patch<ApiResponse<IAttendance>>(
      `/attendance/${attendanceId}/checkout`
    );
    return response.data.data;
  },
};
