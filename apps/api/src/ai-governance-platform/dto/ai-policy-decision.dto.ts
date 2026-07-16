export class CreateAIPolicyDecisionDto {
  id!: string;
  code!: string;
  status!: string;
  active!: boolean;
  score?: number;
  createdAt!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateAIPolicyDecisionDto {
  id?: string;
  code?: string;
  status?: string;
  active?: boolean;
  score?: number;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}