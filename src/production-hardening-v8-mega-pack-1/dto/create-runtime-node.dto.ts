export class CreateRuntimeNodeDto {
  nodeName!: string;
  serviceName!: string;
  environment?: string;
  region?: string;
  capacityUnits?: number;
}
