export interface IResponsibility {
  value: string;
}

export interface ICreateOfficeDto {
  name: string;
  email: string;
  description: string;
  responsibilities: IResponsibility[];
}

export interface IOffice extends ICreateOfficeDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}
