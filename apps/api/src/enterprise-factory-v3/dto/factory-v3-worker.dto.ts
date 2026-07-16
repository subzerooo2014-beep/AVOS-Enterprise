export class CreateFactoryV3WorkerDto {
  id!: string;
  name!: string;
  status!: string;
  capacity!: number;
  lastHeartbeat?: string;
  capabilities?: Record<string, unknown>;
}

export class UpdateFactoryV3WorkerDto {
  id?: string;
  name?: string;
  status?: string;
  capacity?: number;
  lastHeartbeat?: string;
  capabilities?: Record<string, unknown>;
}