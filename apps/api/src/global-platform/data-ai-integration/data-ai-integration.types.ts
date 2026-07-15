export type DataAssetType =
  | "DATASET"
  | "STREAM"
  | "FEATURE_SET"
  | "MODEL"
  | "KNOWLEDGE_GRAPH"
  | "API";

export type DataClassification =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "RESTRICTED";

export type IntegrationProtocol =
  | "REST"
  | "GRAPHQL"
  | "GRPC"
  | "KAFKA"
  | "RABBITMQ"
  | "WEBHOOK";

export interface GlobalDataAsset {
  id: string;
  tenantId: string;
  name: string;
  type: DataAssetType;
  classification: DataClassification;
  region: string;
  owner: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface AiModelRegistration {
  id: string;
  tenantId: string;
  name: string;
  version: string;
  task: string;
  region: string;
  status: "REGISTERED" | "VALIDATED" | "DEPLOYED" | "RETIRED";
  governanceApproved: boolean;
  createdAt: string;
  updatedAt: string;
  metrics: Record<string, number>;
}

export interface FeatureDefinition {
  id: string;
  tenantId: string;
  name: string;
  entity: string;
  dataType: string;
  onlineEnabled: boolean;
  offlineEnabled: boolean;
  createdAt: string;
}

export interface IntegrationEndpoint {
  id: string;
  tenantId: string;
  name: string;
  protocol: IntegrationProtocol;
  endpoint: string;
  region: string;
  enabled: boolean;
  authenticated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceDecision {
  allowed: boolean;
  reasons: string[];
  evaluatedAt: string;
}

export interface DataAiIntegrationHealth {
  system: "AVOS Global Platform";
  component: "Global Data, AI & Integration";
  status: "HEALTHY" | "DEGRADED";
  dataAssets: number;
  models: number;
  deployedModels: number;
  features: number;
  integrations: number;
  enabledIntegrations: number;
  governanceScore: number;
  generatedAt: string;
}