export class CreateG6RecoveryPlanDto {
  id!: string;
  planCode!: string;
  priority!: number;
  approved!: boolean;
  steps?: Record<string, unknown>;
}

export class UpdateG6RecoveryPlanDto {
  id?: string;
  planCode?: string;
  priority?: number;
  approved?: boolean;
  steps?: Record<string, unknown>;
}