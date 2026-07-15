export type FoundationStatus =
  | "PLANNED"
  | "ACTIVE"
  | "SUSPENDED"
  | "RETIRED";

export interface PlatformRegistryEntry {
  key: string;
  name: string;
  version: string;
  status: FoundationStatus;
  owner: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryRegistryEntry {
  key: string;
  name: string;
  sharedCapabilities: string[];
  status: FoundationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityRegistryEntry {
  key: string;
  name: string;
  domain: string;
  shared: boolean;
  status: FoundationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDealRecord {
  id: string;
  tenantId: string;
  leadId: string;
  customerId?: string;
  industry: string;
  capability: string;
  stage:
    | "LEAD"
    | "QUALIFIED"
    | "OPPORTUNITY"
    | "PROPOSAL"
    | "NEGOTIATION"
    | "WON"
    | "LOST";
  value: number;
  currency: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationAuditRecord {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface FoundationEventRecord {
  id: string;
  tenantId: string;
  eventType: string;
  source: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface FoundationDecisionRequest {
  tenantId: string;
  actorId: string;
  industry: string;
  capability: string;
  objective: string;
  context?: Record<string, unknown>;
}

export interface FoundationDecisionResult {
  id: string;
  tenantId: string;
  actorId: string;
  industry: string;
  capability: string;
  objective: string;
  recommendation: string;
  confidence: number;
  requiresOwnerApproval: boolean;
  createdAt: string;
}