export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}

export enum AttendanceType {
  FINGERPRINT = "FINGERPRINT",
  UNIQUE_CODE = "UNIQUE_CODE",
  GUEST_DETAILS = "GUEST_DETAILS",
}

export enum Month {
  JANUARY = "JANUARY",
  FEBRUARY = "FEBRUARY",
  MARCH = "MARCH",
  APRIL = "APRIL",
  MAY = "MAY",
  JUNE = "JUNE",
  JULY = "JULY",
  AUGUST = "AUGUST",
  SEPTEMBER = "SEPTEMBER",
  OCTOBER = "OCTOBER",
  NOVEMBER = "NOVEMBER",
  DECEMBER = "DECEMBER",
}

export interface IAttendance {
  _id: string;
  meetingId: string;
  userId: string;
  userType: "ADMIN" | "OFFICER" | "GUEST";
  attendanceType: AttendanceType;
  meetingDate: string;
  checkInTime: string;
  checkOutTime?: string;
  month: Month;
  verified: boolean;
  verifiedBy?: string;
  status: AttendanceStatus;
  remarks?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  officer?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    uniqueCode: string;
  };
}

export interface AttendanceStats {
  totalExpected: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

export interface ThreeMonthAbsence {
  officer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    uniqueCode: string;
  };
  consecutiveAbsences: number;
  months: Month[];
}

export interface DashboardStats {
  totalOfficers: number;
  upcomingMeetingsCount: number;
  attendanceRate: number;
  pendingCheckIns: number;
}
