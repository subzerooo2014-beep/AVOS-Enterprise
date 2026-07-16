export class CreateInvestmentDecisionDto {
  id!: string;
  code!: string;
  status!: string;
  active!: boolean;
  score?: number;
  createdAt!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateInvestmentDecisionDto {
  id?: string;
  code?: string;
  status?: string;
  active?: boolean;
  score?: number;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}