export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApprovalRecord {
  id: string;
  subject: string;
  status: ApprovalStatus;
  requestedBy?: string;
  approvedBy?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionRecord {
  id: string;
  operation: string;
  status: "STARTED" | "COMPLETED" | "FAILED";
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
