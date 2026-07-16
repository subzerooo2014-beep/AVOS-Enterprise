export class CreateG2MarketOperationDto {
  id!: string;
  marketCode!: string;
  operationType!: string;
  status!: string;
  riskScore?: number;
  metadata?: Record<string, unknown>;
}

export class UpdateG2MarketOperationDto {
  id?: string;
  marketCode?: string;
  operationType?: string;
  status?: string;
  riskScore?: number;
  metadata?: Record<string, unknown>;
}