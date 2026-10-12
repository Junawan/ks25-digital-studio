export type PackflowStatus = "menunggu" | "diproses" | "ready";

export interface PackflowRecord {
  id: string;
  companyId: string;
  barcode: string;
  timestamp: string;
  createdAt: Date;
}

export interface PackflowHistoryRecord {
  id: string;
  companyId: string;
  barcode: string;
  date: string;
  time: string;
  createdAt: Date;
}

export interface SupplyRequest {
  id: string;
  companyId: string;
  itemName: string;
  requester: string;
  date: string;
  status: PackflowStatus;
  createdAt: Date;
}

