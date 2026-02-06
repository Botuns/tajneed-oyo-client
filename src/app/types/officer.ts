export enum UserType {
  ADMIN = "ADMIN",
  OFFICER = "OFFICER",
  GUEST = "GUEST",
}

export enum PositionType {
  EXECUTIVE = "EXECUTIVE",
  HEAD = "HEAD",
  ASSISTANT = "ASSISTANT",
  SPECIAL = "SPECIAL",
}

export interface IOfficer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  positionType: PositionType;
  dila: string;
  uniqueCode: string;
  fingerprint?: string;
  offices: string[];
  userType: UserType;
  isAdmin: boolean;
  tenureStart: string;
  tenureEnd?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOfficerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  positionType: PositionType;
  dila: string;
  tenureStart: string;
  tenureEnd?: string;
  offices?: string[];
  isAdmin?: boolean;
}

export interface IUpdateOfficerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  positionType?: PositionType;
  dila?: string;
  tenureStart?: string;
  tenureEnd?: string;
  offices?: string[];
  userType?: UserType;
  isAdmin?: boolean;
}

// Display helpers
export const getPositionBadgeColor = (type: PositionType): string => {
  switch (type) {
    case PositionType.EXECUTIVE:
      return "purple";
    case PositionType.HEAD:
      return "blue";
    case PositionType.ASSISTANT:
      return "green";
    case PositionType.SPECIAL:
      return "orange";
    default:
      return "gray";
  }
};

export const getPositionBadgeClasses = (type: PositionType): string => {
  switch (type) {
    case PositionType.EXECUTIVE:
      return "bg-purple-50 text-purple-700";
    case PositionType.HEAD:
      return "bg-blue-50 text-blue-700";
    case PositionType.ASSISTANT:
      return "bg-green-50 text-green-700";
    case PositionType.SPECIAL:
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export const getPositionTypeLabel = (type: PositionType): string => {
  switch (type) {
    case PositionType.EXECUTIVE:
      return "Executive";
    case PositionType.HEAD:
      return "Nazim";
    case PositionType.ASSISTANT:
      return "Naib";
    case PositionType.SPECIAL:
      return "Special";
    default:
      return type;
  }
};

export const isNaib = (officer: IOfficer): boolean => {
  return officer.positionType === PositionType.ASSISTANT;
};

export const formatOfficerDisplay = (officer: IOfficer): string => {
  return `${officer.firstName} ${officer.lastName} - ${officer.position} (${officer.dila})`;
};

export const getOfficerFullName = (officer: IOfficer): string => {
  return `${officer.firstName} ${officer.lastName}`;
};

export const getOfficerInitials = (officer: IOfficer): string => {
  return (
    `${officer.firstName?.charAt(0) || ""}${officer.lastName?.charAt(0) || ""}`.toUpperCase() ||
    "?"
  );
};
