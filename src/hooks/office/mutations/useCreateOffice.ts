import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ICreateOfficeDto } from "@/app/types/office";
import { officeService } from "@/app/services/office";
import { toast } from "sonner";

export function useCreateOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateOfficeDto) => officeService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      toast.success("Office created successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message);
      throw error;
    },
  });
}
