export type NervousStreamStatus =
  | "active"
  | "paused"
  | "degraded"
  | "offline";

export type NervousReplayStatus =
  | "created"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface NervousStreamDefinition {
  id: string;
  name: string;
  topic: string;
  partitions: number;
  replicationFactor: number;
  retentionHours: number;
  compacted: boolean;
  ordered: boolean;
  durable: boolean;
  status: NervousStreamStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NervousStreamRecord {
  id: string;
  streamId: string;
  partition: number;
  offset: number;
  key?: string;
  eventType: string;
  payload: unknown;
  headers: Record<string, string>;
  correlationId: string;
  traceId: string;
  causationId?: string;
  checksum: string;
  createdAt: string;
}

export interface NervousConsumerOffset {
  id: string;
  streamId: string;
  consumerGroupId: string;
  partition: number;
  committedOffset: number;
  lastProcessedOffset: number;
  lag: number;
  updatedAt: string;
}

export interface NervousCheckpoint {
  id: string;
  streamId: string;
  consumerGroupId: string;
  offsets: Record<string, number>;
  state: Record<string, unknown>;
  correlationId: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface NervousReplayRequest {
  id: string;
  streamId: string;
  consumerGroupId: string;
  fromOffsets: Record<string, number>;
  toOffsets?: Record<string, number>;
  filterEventTypes: string[];
  dryRun: boolean;
  status: NervousReplayStatus;
  replayedRecords: number;
  failedRecords: number;
  approvedByIdentityId?: string;
  correlationId: string;
  createdByIdentityId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface NervousStreamSnapshot {
  id: string;
  streamId: string;
  name: string;
  lastOffsets: Record<string, number>;
  state: Record<string, unknown>;
  recordCount: number;
  correlationId: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface NervousRetentionRun {
  id: string;
  streamId: string;
  removedRecords: number;
  remainingRecords: number;
  retentionHours: number;
  correlationId: string;
  createdAt: string;
}

export interface NervousCompactionRun {
  id: string;
  streamId: string;
  beforeRecords: number;
  afterRecords: number;
  compactedRecords: number;
  correlationId: string;
  createdAt: string;
}

export interface NervousRecoveryRun {
  id: string;
  streamId: string;
  snapshotId?: string;
  checkpointId?: string;
  recoveredRecords: number;
  status: "completed" | "failed";
  reasons: string[];
  correlationId: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface NervousStreamingHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    streamRegistryScore: number;
    durableLogScore: number;
    offsetScore: number;
    checkpointScore: number;
    replayScore: number;
    snapshotScore: number;
    retentionScore: number;
    compactionScore: number;
    recoveryScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface NervousStreamingAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "stream"
    | "log"
    | "offset"
    | "checkpoint"
    | "replay"
    | "snapshot"
    | "retention"
    | "compaction"
    | "recovery"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
