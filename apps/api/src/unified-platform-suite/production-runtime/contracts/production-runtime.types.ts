export type PersistenceEntity =
  | "platform-component"
  | "platform-event"
  | "workflow-definition"
  | "workflow-run"
  | "distributed-task"
  | "adapter-state"
  | "outbox-message"
  | "inbox-message"
  | "runtime-lease"
  | "checkpoint";

export interface PersistedRecord<T = unknown> {
  id: string;
  entity: PersistenceEntity;
  version: number;
  data: T;
  createdAt: string;
  updatedAt: string;
}

export interface OutboxMessage<T = unknown> {
  id: string;
  topic: string;
  key: string;
  payload: T;
  status: "pending" | "published" | "failed";
  attempts: number;
  nextAttemptAt: string;
  createdAt: string;
  publishedAt?: string;
  error?: string;
}

export interface InboxMessage<T = unknown> {
  id: string;
  source: string;
  messageId: string;
  payload: T;
  status: "received" | "processed" | "failed";
  receivedAt: string;
  processedAt?: string;
  error?: string;
}

export interface RuntimeNode {
  id: string;
  host: string;
  region: string;
  status: "joining" | "active" | "draining" | "offline";
  capabilities: string[];
  heartbeatAt: string;
  startedAt: string;
}

export interface DistributedTask<T = unknown> {
  id: string;
  type: string;
  payload: T;
  status: "queued" | "leased" | "running" | "completed" | "failed" | "dead-lettered";
  assignedNodeId?: string;
  leaseExpiresAt?: string;
  attempts: number;
  maxAttempts: number;
  result?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UltraSuiteAdapterContract {
  suiteId: string;
  suiteName: string;
  version: string;
  health(): Promise<UltraSuiteHealthResult>;
  discoverCapabilities(): Promise<string[]>;
  execute(
    action: string,
    payload: Record<string, unknown>
  ): Promise<Record<string, unknown>>;
}
export interface UltraSuiteHealthResult extends Record<string, unknown> {
  suiteId: string;
  suiteName: string;
  connected: boolean;
  connectionState: "Connected" | "Disconnected";
  statusCode: number | null;
  latencyMs: number;
  lastSuccessfulHealthCheck: string | null;
  checkedAt: string;
  endpoint: string | null;
  status: string;
  error?: string;
  response?: Record<string, unknown>;
}