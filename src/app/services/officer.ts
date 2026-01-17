import { IOfficer } from "../types/officer";
import apiClient from "./api-client";

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export const officerService = {
  getAll: async (): Promise<IOfficer[]> => {
    const response = await apiClient.get<ApiResponse<IOfficer[]>>("/officers");
    return response.data.data;
  },

  getById: async (id: string): Promise<IOfficer> => {
    const response = await apiClient.get<ApiResponse<IOfficer>>(
      `/officers/${id}`
    );
    return response.data.data;
  },

  getByUniqueCode: async (uniqueCode: string): Promise<IOfficer> => {
    const response = await apiClient.get<ApiResponse<IOfficer>>(
      `/officers/unique-code/${uniqueCode}`
    );
    return response.data.data;
  },

  create: async (
    data: Omit<IOfficer, "_id" | "uniqueCode">
  ): Promise<IOfficer> => {
    const response = await apiClient.post<ApiResponse<IOfficer>>(
      "/officers",
      data
    );
    return response.data.data;
  },

  update: async (
    id: string,
    data: Partial<IOfficer>
  ): Promise<IOfficer> => {
    const response = await apiClient.patch<ApiResponse<IOfficer>>(
      `/officers/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/officers/${id}`);
  },
};
