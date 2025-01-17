import { ICreateOfficerDto, IOfficer } from "../types/officer";
import apiClient from "./api-client";

export const officerService = {
  create: async (data: ICreateOfficerDto): Promise<IOfficer> => {
    try {
      const response = await apiClient.post<IOfficer>("/officer", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
