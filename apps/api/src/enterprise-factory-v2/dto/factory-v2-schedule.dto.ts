export class CreateFactoryV2ScheduleDto {
  id!: string;
  blueprintCode!: string;
  cron!: string;
  active!: boolean;
  metadata?: Record<string, unknown>;
}

export class UpdateFactoryV2ScheduleDto {
  id?: string;
  blueprintCode?: string;
  cron?: string;
  active?: boolean;
  metadata?: Record<string, unknown>;
}