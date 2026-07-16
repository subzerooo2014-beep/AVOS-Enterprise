export class CreateFactoryV2ReleaseDto {
  id!: string;
  artifactId!: string;
  channel!: string;
  status!: string;
  releasedAt?: string;
}

export class UpdateFactoryV2ReleaseDto {
  id?: string;
  artifactId?: string;
  channel?: string;
  status?: string;
  releasedAt?: string;
}