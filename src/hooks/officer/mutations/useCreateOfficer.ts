import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officerService } from "@/app/services/officer";
import { ICreateOfficerDto } from "@/app/types/officer";
import { toast } from "@/hooks/use-toast";

export function useCreateOfficer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newOfficer: ICreateOfficerDto) =>
      officerService.create(newOfficer),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["officers"] });
      toast({
        title: "Officer created",
        description: `${data.firstName} ${data.lastName} has been successfully added.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create officer: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
