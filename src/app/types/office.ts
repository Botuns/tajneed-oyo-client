// export interface IResponsibility {
//   value: string;
// }

export interface ICreateOfficeDto {
  name: string;
  email: string;
  description: string;
  responsibilities: string[];
}

export interface IOffice extends ICreateOfficeDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}
