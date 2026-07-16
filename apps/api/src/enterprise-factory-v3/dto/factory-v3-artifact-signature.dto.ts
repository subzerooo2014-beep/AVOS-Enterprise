export class CreateFactoryV3ArtifactSignatureDto {
  id!: string;
  artifactId!: string;
  algorithm!: string;
  signature!: string;
  verified!: boolean;
}

export class UpdateFactoryV3ArtifactSignatureDto {
  id?: string;
  artifactId?: string;
  algorithm?: string;
  signature?: string;
  verified?: boolean;
}