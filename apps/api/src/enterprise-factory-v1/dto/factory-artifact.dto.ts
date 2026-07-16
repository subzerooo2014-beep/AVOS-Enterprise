export class CreateFactoryArtifactDto {
  id!: string;
  jobId!: string;
  artifactType!: string;
  path!: string;
  verified!: boolean;
  metadata?: Record<string, unknown>;
}

export class UpdateFactoryArtifactDto {
  id?: string;
  jobId?: string;
  artifactType?: string;
  path?: string;
  verified?: boolean;
  metadata?: Record<string, unknown>;
}