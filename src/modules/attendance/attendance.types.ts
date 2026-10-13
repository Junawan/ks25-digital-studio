export type AttendanceStage = "checkIn" | "breakOut" | "breakIn" | "checkOut";
export type LeaveStatus = "Menunggu" | "Disetujui" | "Ditolak";

export interface AttendancePunch {
  stage: AttendanceStage;
  time: string;
  photoUrl: string;
}

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeNik: string;
  employeeName: string;
  date: string;
  punches: AttendancePunch[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceEmployee {
  fullName: string;
  nik: string;
  hireDate?: string;
}

export interface AttendanceArticle {
  id: string;
  companyId: string;
  title: string;
  body: string;
  author: string;
  createdAt: Date;
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeNik: string;
  employeeName: string;
  dates: string[];
  reason: string;
  status: LeaveStatus;
  adminNote?: string;
  updatedAt?: Date;
  createdAt: Date;
}
