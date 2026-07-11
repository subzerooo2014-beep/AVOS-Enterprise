export type AvosStatus = "success" | "failed" | "pending" | "skipped";

export interface AvosResult<T = any> {
  status: AvosStatus;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}
