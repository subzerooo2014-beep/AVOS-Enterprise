export type StandardStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type FlowStandard = {
  id: string;
  code: string;
  name: string;
  version: string;
  jurisdiction: string;
  requirements: string[];
  status: StandardStatus;
  createdAt: string;
};

export type FlowConformanceResult = {
  id: string;
  executionId: string;
  standardId: string;
  passed: boolean;
  satisfied: string[];
  missing: string[];
  testedAt: string;
};

export type FlowCertification = {
  id: string;
  executionId: string;
  standardId: string;
  certificateNumber: string;
  status: "issued" | "suspended" | "revoked" | "expired";
  issuedAt: string;
  expiresAt: string;
};

export type FlowCompatibilityRecord = {
  id: string;
  producer: string;
  consumer: string;
  contract: string;
  compatible: boolean;
  issues: string[];
  checkedAt: string;
};
