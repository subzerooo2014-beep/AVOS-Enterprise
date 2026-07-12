import { UltraCValue } from "../contracts";

export interface EnterpriseCapabilityRequest {
  key: string;
  name: string;
  description: string;
  required: boolean;
  priority: number;
  dependencies: string[];
  metadata: Record<string, UltraCValue>;
}

export interface EnterpriseDesignRequest {
  id: string;
  systemKey: string;
  name: string;
  description: string;
  objectives: string[];
  capabilities: EnterpriseCapabilityRequest[];
  constraints: Record<string, UltraCValue>;
  createdAt: string;
}

export interface EnterpriseDesignComponent {
  key: string;
  name: string;
  kind: string;
  responsibilities: string[];
  dependencies: string[];
  capabilities: string[];
}

export interface EnterpriseDesign {
  systemKey: string;
  components: EnterpriseDesignComponent[];
  capabilityCoverage: Record<string, string[]>;
  unresolvedCapabilities: string[];
  generatedAt: string;
}
