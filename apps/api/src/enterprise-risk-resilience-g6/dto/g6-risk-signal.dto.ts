export class CreateG6RiskSignalDto {
  id!: string;
  riskType!: string;
  severity!: number;
  active!: boolean;
  metadata?: Record<string, unknown>;
}

export class UpdateG6RiskSignalDto {
  id?: string;
  riskType?: string;
  severity?: number;
  active?: boolean;
  metadata?: Record<string, unknown>;
}