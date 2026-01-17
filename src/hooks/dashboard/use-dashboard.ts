"use client";

import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/app/services/attendance";
import { meetingService } from "@/app/services/meetings";
import { officerService } from "@/app/services/officer";
import { DashboardStats, ThreeMonthAbsence } from "@/app/types/attendance";
import { IMeeting } from "@/app/types/meetings";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const [officers, upcomingMeetings] = await Promise.all([
        officerService.getAll(),
        meetingService.getUpcoming(),
      ]);

      const activeMeeting = upcomingMeetings.find(
        (m) => m.status === "ongoing"
      );
      let attendanceRate = 0;
      let pendingCheckIns = 0;

      if (activeMeeting) {
        try {
          const stats = await attendanceService.getStats(activeMeeting.id);
          attendanceRate = stats.attendanceRate;
          pendingCheckIns = stats.totalExpected - stats.present;
        } catch {
          // Meeting might not have attendance data yet
        }
      }

      return {
        totalOfficers: officers.length,
        upcomingMeetingsCount: upcomingMeetings.length,
        attendanceRate,
        pendingCheckIns: Math.max(0, pendingCheckIns),
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useUpcomingMeetings(limit = 5) {
  return useQuery<IMeeting[]>({
    queryKey: ["dashboard", "upcoming-meetings", limit],
    queryFn: async () => {
      const meetings = await meetingService.getUpcoming();
      return meetings.slice(0, limit);
    },
    staleTime: 30000,
  });
}

export function useAbsenceAlerts() {
  return useQuery<ThreeMonthAbsence[]>({
    queryKey: ["dashboard", "absence-alerts"],
    queryFn: () => attendanceService.getThreeMonthAbsences(),
    staleTime: 60000,
  });
}

export function useMeetingAttendance(meetingId: string | null) {
  return useQuery({
    queryKey: ["attendance", "meeting", meetingId],
    queryFn: () => attendanceService.getByMeeting(meetingId!),
    enabled: !!meetingId,
    staleTime: 15000,
  });
}
