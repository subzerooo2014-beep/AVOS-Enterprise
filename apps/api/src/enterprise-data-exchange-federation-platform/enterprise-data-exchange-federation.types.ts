export interface FederationNodeRecord {
  id: string;
  name: string;
  endpoint: string;
  region: string;
  status: "ACTIVE" | "DEGRADED" | "OFFLINE";
  capabilities: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DataContractRecord {
  id: string;
  name: string;
  version: string;
  producer: string;
  consumers: string[];
  schemaId: string;
  compatibility: "BACKWARD" | "FORWARD" | "FULL" | "NONE";
  status: "DRAFT" | "ACTIVE" | "DEPRECATED";
  createdAt: string;
  updatedAt: string;
}

export interface SchemaDefinitionRecord {
  id: string;
  name: string;
  version: number;
  format: "JSON" | "AVRO" | "PROTOBUF";
  definition: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DataMappingRecord {
  id: string;
  sourceSchemaId: string;
  targetSchemaId: string;
  mappings: Record<string, string>;
  version: number;
  createdAt: string;
}

export interface DataExchangeMessageRecord {
  id: string;
  contractId: string;
  sourceNodeId: string;
  targetNodeId: string;
  payload: Record<string, unknown>;
  status: "QUEUED" | "DELIVERED" | "FAILED";
  createdAt: string;
  deliveredAt?: string;
  error?: string;
}

export interface DataSynchronizationRecord {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  contractId: string;
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED";
  recordsRead: number;
  recordsWritten: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface FederationLineageRecord {
  id: string;
  messageId: string;
  sourceNodeId: string;
  targetNodeId: string;
  contractId: string;
  createdAt: string;
}

export interface FederationQualityResultRecord {
  id: string;
  messageId: string;
  passed: boolean;
  score: number;
  findings: string[];
  checkedAt: string;
}

export interface FederationMetrics {
  nodes: number;
  activeNodes: number;
  contracts: number;
  activeContracts: number;
  schemas: number;
  mappings: number;
  messages: number;
  deliveredMessages: number;
  failedMessages: number;
  synchronizations: number;
  failedSynchronizations: number;
  lineageRecords: number;
  qualityChecks: number;
  qualityFailures: number;
}

export interface FederationHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: FederationMetrics;
  components: Record<string, string>;
}
