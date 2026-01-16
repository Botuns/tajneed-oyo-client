// hooks/meeting/queries/useMeetings.ts
import { useQuery } from "@tanstack/react-query";
import { MeetingFilters } from "@/app/types/meetings";
import { meetingService } from "@/app/services/meetings";

export function useMeetings(filters: MeetingFilters) {
  return useQuery({
    queryKey: ["meetings", filters],
    queryFn: () => meetingService.getAll(filters),
  });
}