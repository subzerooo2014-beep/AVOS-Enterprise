export interface FoundationStorageObjectV1 {
  id: string;
  namespace: string;
  key: string;
  contentType: string;
  size: number;
  checksum: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationBackupV1 {
  id: string;
  scope: string;
  status: "CREATED" | "VERIFIED" | "RESTORED" | "FAILED";
  objectIds: string[];
  checksum: string;
  createdAt: string;
  restoredAt?: string;
}

export interface FoundationMediaAssetV1 {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  storageObjectId: string;
  tags: string[];
  createdAt: string;
}

export interface FoundationSearchDocumentV1 {
  id: string;
  index: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface FoundationCacheEntryV1 {
  key: string;
  value: unknown;
  expiresAt?: string;
  createdAt: string;
}

export interface FoundationLogRecordV1 {
  id: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  context: Record<string, unknown>;
  createdAt: string;
}

export interface FoundationMetricV1 {
  name: string;
  value: number;
  labels: Record<string, string>;
  recordedAt: string;
}

export interface FoundationTraceSpanV1 {
  id: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  status: "OK" | "ERROR";
  startedAt: string;
  endedAt?: string;
  attributes: Record<string, unknown>;
}

export interface FoundationValidationResultV1 {
  id: string;
  name: string;
  passed: boolean;
  details: string[];
  checkedAt: string;
}

export interface FoundationReliabilityMetricsV1 {
  storageObjects: number;
  backups: number;
  verifiedBackups: number;
  mediaAssets: number;
  searchDocuments: number;
  cacheEntries: number;
  logs: number;
  errorLogs: number;
  metrics: number;
  traces: number;
  validationChecks: number;
  failedValidations: number;
}

export interface FoundationReliabilityStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: FoundationReliabilityMetricsV1;
  components: Record<string, string>;
}
