import { UltraCFinding } from "../contracts";

export interface IntegrationEndpoint {
  key: string;
  protocol: string;
  address: string;
  capabilities: string[];
  authentication: string;
}

export interface IntegrationRoute {
  id: string;
  key: string;
  source: string;
  target: string;
  capability: string;
  controls: string[];
}

export interface IntegrationFabricPlan {
  routes: IntegrationRoute[];
  unresolvedCapabilities: string[];
  findings: UltraCFinding[];
  generatedAt: string;
}
