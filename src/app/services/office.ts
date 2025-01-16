import {
  ICreateOfficeDto,
  IOffice,
  OfficeFilters,
  OfficesResponse,
} from "../types/office";
import apiClient from "./api-client";

export const officeService = {
  create: async (data: ICreateOfficeDto): Promise<IOffice> => {
    try {
      const response = await apiClient.post<IOffice>("/office", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAll: async (filters: OfficeFilters): Promise<OfficesResponse> => {
    try {
      const response = await apiClient.get<OfficesResponse>("/office", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
