export interface PackBuilderV3Capability {
  id: string;
  name: string;
  status: "READY" | "ACTIVE";
}

export interface PackBuilderV3Status {
  success: true;
  system: string;
  version: string;
  capabilities: PackBuilderV3Capability[];
}