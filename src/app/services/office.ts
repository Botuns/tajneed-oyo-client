import {
  ICreateOfficeDto,
  IOffice,
  OfficeFilters,
  OfficesResponse,
} from "../types/office";
import apiClient from "./api-client";

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export const officeService = {
  create: async (data: ICreateOfficeDto): Promise<IOffice> => {
    const response = await apiClient.post<ApiResponse<IOffice>>("/offices", data);
    return response.data.data;
  },

  getAll: async (filters?: OfficeFilters): Promise<OfficesResponse> => {
    const response = await apiClient.get<OfficesResponse>("/offices", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<IOffice> => {
    const response = await apiClient.get<ApiResponse<IOffice>>(`/offices/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<ICreateOfficeDto>): Promise<IOffice> => {
    const response = await apiClient.patch<ApiResponse<IOffice>>(`/offices/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/offices/${id}`);
  },

  addOfficer: async (officeId: string, officerId: string): Promise<IOffice> => {
    const response = await apiClient.post<ApiResponse<IOffice>>(
      `/offices/${officeId}/officers`,
      { officerId }
    );
    return response.data.data;
  },
};
