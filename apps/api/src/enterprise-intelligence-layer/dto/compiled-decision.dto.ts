export class CreateCompiledDecisionDto {
  id!: string;
  code!: string;
  status!: string;
  active!: boolean;
  score?: number;
  createdAt!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateCompiledDecisionDto {
  id?: string;
  code?: string;
  status?: string;
  active?: boolean;
  score?: number;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}