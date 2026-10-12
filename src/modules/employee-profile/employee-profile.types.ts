export interface EmployeeProfile {
  fullName: string;
  nik: string;
}

export interface EmployeeProfileDocument extends EmployeeProfile {
  companyId: string;
  pinHash?: string;
  pinSalt?: string;
  pinIterations?: number;
  createdAt: Date;
  updatedAt: Date;
}
