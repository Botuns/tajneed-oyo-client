import { ICreateOfficeDto, IOffice } from "../types/office";
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
};
