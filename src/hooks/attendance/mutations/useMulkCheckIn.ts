import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/app/services/attendance";
import { toast } from "@/hooks/use-toast";

interface MulkCheckInParams {
  meetingId: string;
  uniqueCode: string;
}

export function useMulkCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, uniqueCode }: MulkCheckInParams) =>
      attendanceService.checkInMulkByCode(meetingId, uniqueCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Mulk check-in successful",
        description: "The mulk member has been checked in.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Mulk check-in failed",
        description:
          error.message ||
          "Unable to check in. Verify the code belongs to a mulk member.",
        variant: "destructive",
      });
    },
  });
}
