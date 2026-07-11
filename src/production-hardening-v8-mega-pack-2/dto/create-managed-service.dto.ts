export class CreateManagedServiceDto {
  serviceName!: string;
  environment?: string;
  region?: string;
  owner?: string;
  version?: string;
  instances?: number;
  minimumInstances?: number;
  maximumInstances?: number;
}
