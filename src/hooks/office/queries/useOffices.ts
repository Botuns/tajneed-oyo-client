import { useQuery } from "@tanstack/react-query";
import { OfficeFilters } from "@/app/types/office";
import { officeService } from "@/app/services/office";

export function useOffices(filters: OfficeFilters) {
  return useQuery({
    queryKey: ["offices", filters],
    queryFn: () => officeService.getAll(filters),
  });
}
