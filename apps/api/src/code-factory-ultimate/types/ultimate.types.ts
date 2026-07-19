export type JobStatus = "queued" | "leased" | "running" | "completed" | "failed" | "dead-letter" | "cancelled";
export type SupportedLanguage = "typescript" | "python" | "dart" | "go" | "csharp";

export interface DurableJob<T = Record<string, unknown>> {
  id: string;
  type: string;
  status: JobStatus;
  priority: number;
  payload: T;
  attempts: number;
  maxAttempts: number;
  availableAt: string;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  traceId: string;
}

export interface WorkerRecord {
  id: string;
  name: string;
  status: "idle" | "working" | "stopped" | "unhealthy";
  supportedTypes: string[];
  activeJobId?: string;
  processed: number;
  failed: number;
  lastHeartbeatAt: string;
}

export interface GenerationBlueprint {
  id?: string;
  name: string;
  description?: string;
  language: SupportedLanguage;
  framework?: string;
  namespace?: string;
  entities?: Array<{ name: string; fields: Array<{ name: string; type: string; optional?: boolean }> }>;
  endpoints?: Array<{ method: string; path: string; operation: string }>;
  metadata?: Record<string, unknown>;
}

export interface GeneratedFile {
  relativePath: string;
  content: string;
  language: SupportedLanguage;
  sha256: string;
}

export interface GenerationPackage {
  id: string;
  blueprintId: string;
  name: string;
  language: SupportedLanguage;
  framework?: string;
  files: GeneratedFile[];
  manifest: Record<string, unknown>;
  createdAt: string;
}

export interface ArchitecturePlan {
  id: string;
  objective: string;
  status: "draft" | "awaiting-human-approval" | "approved" | "rejected" | "generated";
  confidence: number;
  risk: "low" | "medium" | "high";
  recommendedLanguage: SupportedLanguage;
  recommendedFramework: string;
  components: Array<{ name: string; responsibility: string; dependencies: string[] }>;
  blueprint: GenerationBlueprint;
  rationale: string[];
  requiresHumanApproval: true;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UltimateCertification {
  id: string;
  status: "certified" | "not-certified" | "failed";
  score: number;
  checks: Record<string, boolean>;
  evidence: Record<string, unknown>;
  approvedBy: string;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  certifiedAt: string;
}
