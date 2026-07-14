export type GovernanceStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "RETIRED";

export interface ConstitutionalRuleRecord {
  id: string;
  code: string;
  title: string;
  principle: string;
  scope: string[];
  priority: number;
  status: GovernanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationRecord {
  id: string;
  framework: string;
  subjectId: string;
  score: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  issuedAt?: string;
  expiresAt?: string;
}
