export type ConnectorStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "FAILED" | "DEPRECATED";

export interface ConnectorRecord {
  id: string;
  code: string;
  name: string;
  category: string;
  status: ConnectorStatus;
  version: string;
  endpoint?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationExecutionRecord {
  id: string;
  connectorId: string;
  operation: string;
  payload: Record<string, unknown>;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  attempts: number;
  createdAt: string;
  updatedAt: string;
}
