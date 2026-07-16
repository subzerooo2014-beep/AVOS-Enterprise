export class CreateG3RevenueExperimentDto {
  id!: string;
  name!: string;
  status!: string;
  uplift?: number;
  configuration?: Record<string, unknown>;
}

export class UpdateG3RevenueExperimentDto {
  id?: string;
  name?: string;
  status?: string;
  uplift?: number;
  configuration?: Record<string, unknown>;
}