import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/app/services/attendance";

// Per-role attendance lists (officers, dila qaids, mulk, guests) for a meeting.
export function useMeetingBreakdown(meetingId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "breakdown", meetingId],
    queryFn: () => attendanceService.getMeetingBreakdown(meetingId as string),
    enabled: !!meetingId,
  });
}

// Per-role status counts plus overall totals for a meeting.
export function useMeetingStatsBreakdown(meetingId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "stats-breakdown", meetingId],
    queryFn: () =>
      attendanceService.getMeetingStatsBreakdown(meetingId as string),
    enabled: !!meetingId,
  });
}
