export interface ICreateOfficeDto {
  name: string;
  email: string;
  description: string;
  responsibilities: string[];
}

export interface IOffice {
  _id: string;
  id?: string;
  name: string;
  email: string;
  description: string;
  officers: string[];
  totalOfficers: number;
  responsibilities: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeFilters {
  search?: string;
  sortBy?: "name" | "totalOfficers" | "createdAt";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface OfficesResponse {
  message: string;
  data: IOffice[];
  status: string;
}
