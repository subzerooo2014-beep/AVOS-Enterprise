export interface AvosFactoryRuntimeStatus {
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  status: "healthy" | "degraded";
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  components: {
    blueprintEngine: boolean;
    codeGenerationEngine: boolean;
    templateEngine: boolean;
    aiGenerator: boolean;
    projectGenerator: boolean;
    projectExecution: boolean;
    filesystemTransaction: boolean;
    rollbackEngine: boolean;
    projectManifest: boolean;
    verificationEngine: boolean;
    smokeTest: boolean;
  };
  registeredProjectKinds: number;
  generatedAt: string;
}

export interface AvosFactoryVerificationCheck {
  name: string;
  passed: boolean;
  details?: Record<string, unknown>;
}

export interface AvosFactoryVerificationReport {
  id: string;
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  passed: boolean;
  score: number;
  checks: AvosFactoryVerificationCheck[];
  blockingFindings: string[];
  humanFinalAuthority: true;
  generatedAt: string;
}

export interface AvosFactoryCertificationRecord {
  id: string;
  verificationReportId: string;
  system: "AVOS Factory Core V1";
  status: "certified" | "rejected";
  score: number;
  certifiedBy: string;
  approvedBy: string;
  humanFinalAuthority: true;
  certifiedAt: string;
  reasons: string[];
}
