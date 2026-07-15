export const PRODUCTION_RELEASE_CAPABILITIES = [
  'release-manifest-engine',
  'release-notes-engine',
  'release-artifact-registry',
  'final-build-validation-engine',
  'final-smoke-validation-engine',
  'final-integration-validation-engine',
  'final-verification-engine',
  'production-certificate-registry',
  'release-tag-readiness-engine',
  'rollback-manifest-engine',
  'deployment-manifest-engine',
  'release-governance-engine',
  'production-release-orchestrator',
  'production-release-dashboard',
] as const;

export type ProductionReleaseCapability =
  (typeof PRODUCTION_RELEASE_CAPABILITIES)[number];

export interface ReleaseManifest {
  id: string;
  version: string;
  commitSha: string;
  branch: string;
  createdAt: string;
  buildPassed: boolean;
  typescriptPassed: boolean;
  flutterAnalyzePassed: boolean;
  smokePassed: boolean;
  integrationPassed: boolean;
  verificationPassed: boolean;
  certificationPassed: boolean;
  status: 'draft' | 'ready' | 'released' | 'rejected';
}

export interface ReleaseArtifact {
  id: string;
  type: string;
  path: string;
  checksum?: string;
  required: boolean;
}

export interface ReleaseApproval {
  id: string;
  role: 'qa' | 'security' | 'operations' | 'cto' | 'executive';
  approved: boolean;
  approvedAt: string;
}

export interface RollbackManifest {
  releaseVersion: string;
  previousVersion?: string;
  databaseRollbackReady: boolean;
  applicationRollbackReady: boolean;
  configurationRollbackReady: boolean;
  artifactRollbackReady: boolean;
}

export interface DeploymentManifest {
  releaseVersion: string;
  environment: string;
  imageTags: string[];
  migrationsRequired: boolean;
  zeroDowntime: boolean;
  healthEndpoint: string;
  readinessEndpoint: string;
}

export interface ProductionReleaseDashboardSnapshot {
  generatedAt: string;
  buildScore: number;
  testScore: number;
  certificationScore: number;
  artifactScore: number;
  approvalScore: number;
  releaseScore: number;
  releaseStatus: string;
  capabilityStatus: Record<
    ProductionReleaseCapability,
    'operational'
  >;
}