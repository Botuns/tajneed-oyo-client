export enum UserType {
  ADMIN = "ADMIN",
  OFFICER = "OFFICER",
  GUEST = "GUEST",
}
export interface IOfficer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  offices: string[];
  userType: UserType;
  isAdmin: boolean;
  tenureStart: Date;
  tenureEnd: Date;
  fingerprint?: string;
  uniqueCode: string;
  phoneNumber?: string;
}

export type ICreateOfficerDto = Omit<IOfficer, "_id">;
