export type SovereignZoneStatus =
  | "provisioning"
  | "active"
  | "restricted"
  | "suspended"
  | "retired";

export type SovereignZone = {
  id: string;
  name: string;
  country: string;
  region: string;
  residencyPolicy: string;
  encryptionProfile: string;
  status: SovereignZoneStatus;
  createdAt: string;
};

export type FlowJurisdictionDecision = {
  id: string;
  executionId: string;
  zoneId: string;
  allowed: boolean;
  reasons: string[];
  decidedAt: string;
};

export type FlowEncryptionKey = {
  id: string;
  zoneId: string;
  alias: string;
  version: number;
  status: "active" | "rotating" | "retired";
  createdAt: string;
  rotatedAt?: string;
};

export type FlowContinuityPlan = {
  id: string;
  flow: string;
  primaryZoneId: string;
  secondaryZoneId: string;
  recoveryPointObjectiveMinutes: number;
  recoveryTimeObjectiveMinutes: number;
  status: "draft" | "active" | "tested";
  createdAt: string;
  testedAt?: string;
};
