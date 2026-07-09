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

// Auxiliary body a walk-in guest belongs to.
export enum AuxiliaryType {
  KHUDDAM = "KHUDDAM",
  ANSARULLAH = "ANSARULLAH",
  OTHERS = "OTHERS",
}

// Roles surfaced by the per-meeting attendance breakdown endpoint.
export enum AttendanceRole {
  OFFICER = "OFFICER", // Officer that is neither mulk nor Dila Qaid
  DILA_QAID = "DILA_QAID", // Officer with position === "DILA_QAID"
  MULK = "MULK", // Officer with isMulk === true
  GUEST = "GUEST", // Walk-in guest
}

export const AUXILIARY_LABELS: Record<AuxiliaryType, string> = {
  [AuxiliaryType.KHUDDAM]: "Khuddam",
  [AuxiliaryType.ANSARULLAH]: "Ansarullah",
  [AuxiliaryType.OTHERS]: "Others",
};

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

// Walk-in guest: no pre-registration. The full profile is submitted at
// check-in time and the backend creates the Guest record inline (reusing an
// existing guest with the same phone number).
export interface ICheckInGuestDto {
  meetingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  auxiliary: AuxiliaryType;
  state: string;
  purpose: string;
}

// A user (officer or guest) as populated inside a breakdown attendance record.
export interface IPopulatedAttendee {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  // Officer-only fields
  uniqueCode?: string;
  position?: string;
  dila?: string;
  isMulk?: boolean;
  // Guest-only fields
  auxiliary?: AuxiliaryType;
  state?: string;
  purpose?: string;
}

// Attendance record as returned by the breakdown endpoint, where `userId`
// is populated with the officer/guest document.
export interface IBreakdownAttendance extends Omit<IAttendance, "userId"> {
  userId: string | IPopulatedAttendee;
}

export interface MeetingAttendanceBreakdown {
  officers: IBreakdownAttendance[];
  dilaQaids: IBreakdownAttendance[];
  mulk: IBreakdownAttendance[];
  guests: IBreakdownAttendance[];
}

export interface RoleStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}

export interface MeetingStatsBreakdown {
  officers: RoleStats;
  dilaQaids: RoleStats;
  mulk: RoleStats;
  guests: RoleStats;
  totals: RoleStats;
}
