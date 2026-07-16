export class CreateG5FinancialSnapshotDto {
  id!: string;
  period!: string;
  revenue!: number;
  cost!: number;
  metadata?: Record<string, unknown>;
}

export class UpdateG5FinancialSnapshotDto {
  id?: string;
  period?: string;
  revenue?: number;
  cost?: number;
  metadata?: Record<string, unknown>;
}