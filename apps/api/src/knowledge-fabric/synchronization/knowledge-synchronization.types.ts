export type KnowledgeSyncState = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CONFLICTED" | "RETRYING";
export type KnowledgeSyncMode = "PUSH" | "PULL" | "BIDIRECTIONAL";
export type KnowledgeConflictStrategy = "SOURCE_WINS" | "TARGET_WINS" | "LATEST_WINS" | "MANUAL";

export interface KnowledgeSyncEndpoint { id: string; namespace: string; nodeId: string; version: number; checksum?: string; }
export interface KnowledgeSyncJob { id: string; source: KnowledgeSyncEndpoint; target: KnowledgeSyncEndpoint; mode: KnowledgeSyncMode; state: KnowledgeSyncState; strategy: KnowledgeConflictStrategy; attempts: number; maxAttempts: number; createdAt: string; updatedAt: string; }
export interface KnowledgeSyncConflict { id: string; jobId: string; knowledgeId: string; sourceVersion: number; targetVersion: number; sourceChecksum?: string; targetChecksum?: string; resolvable: boolean; strategy: KnowledgeConflictStrategy; detectedAt: string; }
export interface KnowledgeSyncCheckpoint { jobId: string; sequence: number; cursor: string; processed: number; failed: number; createdAt: string; }
export interface KnowledgeSyncResult { job: KnowledgeSyncJob; transferred: number; skipped: number; conflicts: KnowledgeSyncConflict[]; checkpoint: KnowledgeSyncCheckpoint; completedAt: string; }