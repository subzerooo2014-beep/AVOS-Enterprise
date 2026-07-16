export interface G10ExecutionOrder {
  id: string;
  orderType: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}