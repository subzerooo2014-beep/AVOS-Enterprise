export interface AvosFactoryArchitectureFinding {
  id: string;
  category:
    | "architecture"
    | "governance"
    | "security"
    | "operations"
    | "quality"
    | "release";
  severity:
    | "info"
    | "warning"
    | "blocking";
  title: string;
  description: string;
  recommendation?: string;
}

export interface AvosFactoryArchitectureReview {
  id: string;
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  score: number;
  passed: boolean;
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  layersReviewed: string[];
  findings: AvosFactoryArchitectureFinding[];
  blockingFindings: number;
  generatedAt: string;
}

export interface AvosFactoryE2ECheck {
  name: string;
  passed: boolean;
  details?: Record<string, unknown>;
}

export interface AvosFactoryE2EReport {
  id: string;
  system: "AVOS Factory Core V1";
  passed: boolean;
  score: number;
  checks: AvosFactoryE2ECheck[];
  generatedAt: string;
}

export interface AvosFactoryReleaseReadinessReport {
  id: string;
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  ready: boolean;
  score: number;
  architectureReviewPassed: boolean;
  e2ePassed: boolean;
  operationalReadinessPassed: boolean;
  verificationPassed: boolean;
  certificationPassed: boolean;
  humanFinalAuthority: true;
  blockingFindings: string[];
  generatedAt: string;
}

export interface AvosFactoryFinalCertification {
  id: string;
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  status:
    | "certified-for-production"
    | "rejected";
  score: number;
  releaseReadinessReportId: string;
  certifiedBy:
    "avos-factory:final-certification-engine";
  approvedBy: string;
  humanFinalAuthority: true;
  reasons: string[];
  certifiedAt: string;
}
