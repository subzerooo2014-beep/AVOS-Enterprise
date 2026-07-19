export type InspectionSeverity = "required" | "recommended" | "optional";
export type InspectionStatus = "pass" | "warn" | "fail" | "skipped";

export interface InspectionEvidence {
  readonly key: string;
  readonly value: string | number | boolean | null;
}

export interface InspectionRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: InspectionSeverity;
  readonly weight: number;
  readonly enabled: boolean;
}

export interface InspectionResult {
  readonly ruleId: string;
  readonly name: string;
  readonly category: string;
  readonly severity: InspectionSeverity;
  readonly status: InspectionStatus;
  readonly weight: number;
  readonly durationMs: number;
  readonly message: string;
  readonly evidence: readonly InspectionEvidence[];
}

export interface CertificationScore {
  readonly totalWeight: number;
  readonly passedWeight: number;
  readonly warningWeight: number;
  readonly failedWeight: number;
  readonly score: number;
}

export type CertificationClassification =
  | "enterprise-certified"
  | "production-ready"
  | "conditional"
  | "not-certified";

export interface CertificationReport {
  readonly certificationId: string;
  readonly version: string;
  readonly status: "certified" | "certified-with-observations" | "conditional" | "failed";
  readonly classification: CertificationClassification;
  readonly score: CertificationScore;
  readonly requiredFailures: number;
  readonly warnings: number;
  readonly humanFinalAuthority: true;
  readonly generatedAt: string;
  readonly results: readonly InspectionResult[];
}
