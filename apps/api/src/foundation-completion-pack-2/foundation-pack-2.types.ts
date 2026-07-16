export type FoundationIdentityType =
  | "user"
  | "organization"
  | "agent"
  | "capability"
  | "service"
  | "decision"
  | "data-asset";

export interface FoundationIdentity {
  id: string;
  type: FoundationIdentityType;
  name: string;
  owner: string;
  trustLevel: number;
  authorityLevel: "observe" | "recommend" | "execute-with-approval" | "execute";
  status: "active" | "suspended" | "retired";
  createdAt: string;
}

export type CapabilityLifecycleStage =
  | "concept"
  | "prototype"
  | "shared-capability"
  | "core-engine"
  | "platform-service"
  | "standalone-product"
  | "legacy-asset";

export interface CapabilityAsset {
  id: string;
  name: string;
  category: "engine" | "capability" | "agent" | "service" | "pattern" | "reusable-asset";
  version: string;
  ownerIdentityId: string;
  lifecycleStage: CapabilityLifecycleStage;
  trustScore: number;
  status: "active" | "experimental" | "deprecated" | "retired";
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
  relation:
    | "depends-on"
    | "uses"
    | "produces"
    | "governed-by"
    | "owned-by"
    | "observed-by";
  criticality: "low" | "medium" | "high" | "critical";
}
