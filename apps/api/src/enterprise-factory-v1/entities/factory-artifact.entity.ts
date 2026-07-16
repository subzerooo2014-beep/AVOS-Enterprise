export interface FactoryArtifact {
  id: string;
  jobId: string;
  artifactType: string;
  path: string;
  verified: boolean;
  metadata?: Record<string, unknown>;
}