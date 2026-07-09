import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/app/services/attendance";
import { IAttendance, ICheckInGuestDto } from "@/app/types/attendance";
import { toast } from "@/hooks/use-toast";

export function useGuestCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ICheckInGuestDto) => attendanceService.checkInGuest(dto),
    // The check-in response is not populated, so surface the submitted name.
    onSuccess: (_data: IAttendance, variables: ICheckInGuestDto) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Guest checked in",
        description: `${variables.firstName} ${variables.lastName} has been checked in.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Guest check-in failed",
        description:
          error.message || "Unable to check in this guest. Please try again.",
        variant: "destructive",
      });
    },
  });
}
