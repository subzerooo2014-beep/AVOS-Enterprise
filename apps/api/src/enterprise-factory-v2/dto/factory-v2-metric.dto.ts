export class CreateFactoryV2MetricDto {
  id!: string;
  metric!: string;
  value!: number;
  recordedAt!: string;
  tags?: Record<string, unknown>;
}

export class UpdateFactoryV2MetricDto {
  id?: string;
  metric?: string;
  value?: number;
  recordedAt?: string;
  tags?: Record<string, unknown>;
}