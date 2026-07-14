export type FinanceStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export interface FinanceApplicationRecord {
  id: string;
  customerId: string;
  vehicleId?: string;
  amount: number;
  termMonths: number;
  status: FinanceStatus;
  interestRate?: number;
  monthlyPayment?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletRecord {
  id: string;
  ownerId: string;
  balance: number;
  currency: string;
  status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}
