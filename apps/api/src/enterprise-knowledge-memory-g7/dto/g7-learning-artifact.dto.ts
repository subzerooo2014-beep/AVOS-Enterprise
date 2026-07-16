export class CreateG7LearningArtifactDto {
  id!: string;
  artifactType!: string;
  source!: string;
  confidence!: number;
  metadata?: Record<string, unknown>;
}

export class UpdateG7LearningArtifactDto {
  id?: string;
  artifactType?: string;
  source?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}