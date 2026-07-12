export interface Customer {
  customerId: string;
  companyId: string;

  name: string;
  phone: string | null;
  address: string | null;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  companyId: string;

  name: string;
  phone?: string;
  address?: string;

  active?: boolean;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string | null;
  address?: string | null;

  active?: boolean;

  updatedAt?: Date;
}