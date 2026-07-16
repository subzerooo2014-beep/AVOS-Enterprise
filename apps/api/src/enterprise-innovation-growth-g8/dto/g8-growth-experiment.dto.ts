export class CreateG8GrowthExperimentDto {
  id!: string;
  experimentCode!: string;
  status!: string;
  uplift?: number;
  startedAt!: string;
}

export class UpdateG8GrowthExperimentDto {
  id?: string;
  experimentCode?: string;
  status?: string;
  uplift?: number;
  startedAt?: string;
}