export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  email: string;
}