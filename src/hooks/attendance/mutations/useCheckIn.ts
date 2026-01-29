import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/app/services/attendance";
import { IAttendance } from "@/app/types/attendance";
import { toast } from "@/hooks/use-toast";

interface CheckInParams {
  meetingId: string;
  uniqueCode: string;
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, uniqueCode }: CheckInParams) =>
      attendanceService.checkInByCode(meetingId, uniqueCode),
    onSuccess: (data: IAttendance) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Check-in successful",
        description: `${data.officer?.firstName ?? "Officer"} ${data.officer?.lastName ?? ""} has been checked in.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Check-in failed",
        description: error.message || "Unable to check in. Please verify the code and try again.",
        variant: "destructive",
      });
    },
  });
}
