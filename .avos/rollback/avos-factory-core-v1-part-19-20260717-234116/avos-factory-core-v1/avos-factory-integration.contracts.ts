export type AvosFactoryIntegrationTarget =
  | "enterprise-kernel"
  | "capability-fabric"
  | "knowledge-fabric"
  | "living-blueprint"
  | "digital-dna";

export type AvosFactoryIntegrationStatus =
  | "connected"
  | "available"
  | "not-detected"
  | "degraded";

export interface AvosFactoryIntegrationDescriptor {
  target: AvosFactoryIntegrationTarget;
  status: AvosFactoryIntegrationStatus;
  detectedPaths: string[];
  capabilities: string[];
  requiredForProduction: boolean;
  lastCheckedAt: string;
}

export interface AvosFactoryIntegrationRegistry {
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  integrations: AvosFactoryIntegrationDescriptor[];
  connectedCount: number;
  availableCount: number;
  missingCount: number;
  generatedAt: string;
}

export interface AvosFactoryIntegrationEvent {
  id: string;
  target: AvosFactoryIntegrationTarget;
  action: string;
  actor: string;
  payload: Record<string, unknown>;
  humanApproved: boolean;
  approvedBy?: string;
  createdAt: string;
}

export interface AvosFactoryBlueprintRegistration {
  id: string;
  factoryVersion: "1.0.0";
  blueprintType: "factory-core";
  architectureLayers: string[];
  capabilities: string[];
  governance: {
    foundationFirst: true;
    capabilityFirst: true;
    blueprintDriven: true;
    humanFinalAuthority: true;
  };
  registeredAt: string;
}

export interface AvosFactoryDigitalDNARecord {
  id: string;
  assetType: "platform-core";
  assetName: "AVOS Factory Core V1";
  purpose: string;
  version: "1.0.0";
  dependencies: AvosFactoryIntegrationTarget[];
  capabilities: string[];
  policies: string[];
  metrics: string[];
  lifecycle: "certified";
  humanFinalAuthority: true;
  generatedAt: string;
}

export interface AvosFactoryIntegrationVerification {
  id: string;
  passed: boolean;
  score: number;
  checks: Record<string, boolean>;
  registry: AvosFactoryIntegrationRegistry;
  blueprint: AvosFactoryBlueprintRegistration;
  digitalDNA: AvosFactoryDigitalDNARecord;
  blockingFindings: string[];
  generatedAt: string;
}
