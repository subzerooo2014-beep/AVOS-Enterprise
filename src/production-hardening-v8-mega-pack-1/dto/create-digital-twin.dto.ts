export class CreateDigitalTwinDto {
  name!: string;
  serviceName!: string;
  environment?: string;
  runtimeNodeIds!: string[];
}
