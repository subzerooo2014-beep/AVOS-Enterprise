export type GeneratorArtifactKind =
  | 'module'
  | 'controller'
  | 'service'
  | 'orchestrator'
  | 'contract'
  | 'registry'
  | 'health'
  | 'verification'
  | 'certification';

export interface PackageGeneratorFileSpec {
  relativePath: string;
  content: string;
  kind: GeneratorArtifactKind;
  overwrite?: boolean;
}

export interface PackageGeneratorModuleRegistration {
  parentModulePath: string;
  moduleClassName: string;
  moduleImportPath: string;
}

export interface PackageGeneratorRequest {
  packageId: string;
  packageName: string;
  packageVersion: string;
  targetRoot: string;
  files: PackageGeneratorFileSpec[];
  registrations?: PackageGeneratorModuleRegistration[];
  runTypeCheck?: boolean;
  runBuild?: boolean;
  createRollback?: boolean;
  approvedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface PackageGeneratorValidationIssue {
  code: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  file?: string;
}

export interface PackageGeneratorValidationReport {
  valid: boolean;
  score: number;
  issues: PackageGeneratorValidationIssue[];
  checkedAt: string;
}

export interface PackageGeneratorExecutionResult {
  id: string;
  packageId: string;
  packageName: string;
  packageVersion: string;
  status: 'generated' | 'failed';
  targetRoot: string;
  generatedFiles: string[];
  rollbackPath?: string;
  validation: PackageGeneratorValidationReport;
  typeCheckPassed: boolean;
  buildPassed: boolean;
  registeredModules: string[];
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  executedAt: string;
}

export interface PackageGeneratorCertification {
  id: string;
  executionId: string;
  packageId: string;
  status: 'certified' | 'rejected';
  score: number;
  approvedBy: string;
  checks: Record<string, boolean>;
  certifiedAt: string;
}
