export class CreateCheckpointDto {
  profileId!: string;
  serviceName!: string;
  version!: string;
  metadata?: Record<string, unknown>;
}
