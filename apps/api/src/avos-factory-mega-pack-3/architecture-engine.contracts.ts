export type ArchitectureNodeType =
  | "domain"
  | "module"
  | "capability"
  | "service"
  | "api"
  | "data"
  | "event"
  | "workflow"
  | "integration"
  | "security"
  | "ai"
  | "ui"
  | "deployment";

export interface ArchitectureNode {
  id: string;
  type: ArchitectureNodeType;
  name: string;
  description?: string;
  dependsOn: string[];
  metadata: Record<string, unknown>;
}

export interface ArchitectureBlueprintInput {
  id?: string;
  name: string;
  version?: string;
  description?: string;
  domains?: Array<{
    name: string;
    description?: string;
    modules?: Array<{
      name: string;
      description?: string;
      capabilities?: string[];
      services?: string[];
      apis?: string[];
      entities?: string[];
      events?: string[];
      workflows?: string[];
    }>;
  }>;
  integrations?: string[];
  securityRoles?: string[];
  aiCapabilities?: string[];
  uiSurfaces?: string[];
  deploymentUnits?: string[];
}

export interface ArchitectureFinding {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  nodeId?: string;
}

export interface ArchitectureQuality {
  score: number;
  cohesionScore: number;
  couplingScore: number;
  reusabilityScore: number;
  maintainabilityScore: number;
  governanceScore: number;
}

export interface EnterpriseArchitectureModel {
  id: string;
  blueprintId: string;
  name: string;
  version: string;
  status: "draft" | "validated" | "certified";
  nodes: ArchitectureNode[];
  findings: ArchitectureFinding[];
  quality: ArchitectureQuality;
  generatedAt: string;
  certifiedAt?: string;
  humanApprovalRequired: true;
}

export interface ArchitectureEngineStatus {
  system: "AVOS Factory";
  megaPack: 3;
  component: "Factory Architecture Engine";
  status: "healthy";
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  registeredArchitectures: number;
  supportedDesigners: string[];
}
