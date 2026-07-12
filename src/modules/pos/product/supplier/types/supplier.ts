export interface Supplier {
  supplierId: string;
  companyId: string;

  name: string;
  phone: string | null;
  address: string | null;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierInput {
  companyId: string;

  name: string;
  phone?: string;
  address?: string;

  active?: boolean;
}

export interface UpdateSupplierInput {
  name?: string;
  phone?: string | null;
  address?: string | null;

  active?: boolean;

  updatedAt?: Date;
}