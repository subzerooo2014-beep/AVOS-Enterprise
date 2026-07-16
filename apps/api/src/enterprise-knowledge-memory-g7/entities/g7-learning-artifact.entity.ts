export interface G7LearningArtifact {
  id: string;
  artifactType: string;
  source: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}