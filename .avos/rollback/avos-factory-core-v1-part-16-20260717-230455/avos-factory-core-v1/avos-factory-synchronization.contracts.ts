export type AvosFactorySyncTarget =
  | "enterprise-kernel"
  | "capability-fabric"
  | "knowledge-fabric"
  | "living-blueprint"
  | "digital-dna";

export type AvosFactorySyncStatus =
  | "pending"
  | "synchronized"
  | "failed";

export interface AvosFactoryDomainEvent {
  id: string;
  type:
    | "factory.project.planned"
    | "factory.project.generated"
    | "factory.project.executed"
    | "factory.project.rolled-back"
    | "factory.verification.completed"
    | "factory.certification.completed"
    | "factory.integration.synchronized";
  source: "AVOS Factory Core V1";
  actor: string;
  approvedBy?: string;
  humanApproved: boolean;
  correlationId: string;
  subjectId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface AvosFactorySynchronizationRecord {
  id: string;
  target: AvosFactorySyncTarget;
  status: AvosFactorySyncStatus;
  eventId: string;
  subjectId: string;
  actor: string;
  approvedBy?: string;
  attempt: number;
  response?: unknown;
  error?: string;
  synchronizedAt?: string;
  createdAt: string;
}

export interface AvosFactoryCapabilityRegistration {
  id: string;
  capabilityId: "avos.factory.core.v1";
  name: "AVOS Factory Core V1";
  version: "1.0.0";
  lifecycle: "platform-service";
  status: "certified";
  contracts: string[];
  dependencies: string[];
  policies: string[];
  humanFinalAuthority: true;
  registeredAt: string;
}

export interface AvosFactoryKnowledgePublication {
  id: string;
  knowledgeType: "architecture-and-runtime";
  title: "AVOS Factory Core V1 Knowledge";
  version: "1.0.0";
  topics: string[];
  provenance: {
    source: "AVOS Factory Core V1";
    generatedBy: "avos-factory:knowledge-publisher";
    humanApproved: true;
    approvedBy: string;
  };
  publishedAt: string;
}

export interface AvosFactoryBlueprintSyncRecord {
  id: string;
  blueprintId: string;
  version: "1.0.0";
  synchronizedComponents: string[];
  runtimeState: "healthy";
  humanFinalAuthority: true;
  synchronizedAt: string;
}

export interface AvosFactoryDNAEvolutionRecord {
  id: string;
  dnaId: string;
  previousVersion: "1.0.0";
  currentVersion: "1.0.1";
  evolutionType: "enterprise-integration";
  changes: string[];
  approvedBy: string;
  humanApproved: true;
  evolvedAt: string;
}

export interface AvosFactorySynchronizationReport {
  id: string;
  passed: boolean;
  score: number;
  checks: Record<string, boolean>;
  eventCount: number;
  synchronizationCount: number;
  capabilityRegistration?: AvosFactoryCapabilityRegistration;
  knowledgePublication?: AvosFactoryKnowledgePublication;
  blueprintSync?: AvosFactoryBlueprintSyncRecord;
  dnaEvolution?: AvosFactoryDNAEvolutionRecord;
  blockingFindings: string[];
  generatedAt: string;
}
