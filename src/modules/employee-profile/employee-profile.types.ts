export interface EmployeeProfile {
  fullName: string;
  nik: string;
  hireDate?: string;
  type?: "owner" | "employee";
  division?: string;
  daysOff?: number[];
}

export interface EmployeeProfileDocument extends EmployeeProfile {
  companyId: string;
  pinHash?: string;
  pinSalt?: string;
  pinIterations?: number;
  hireDate?: string;
  createdAt: Date;
  updatedAt: Date;
}
