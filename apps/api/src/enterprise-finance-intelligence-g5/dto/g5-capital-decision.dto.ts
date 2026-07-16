export class CreateG5CapitalDecisionDto {
  id!: string;
  decisionType!: string;
  amount!: number;
  status!: string;
  rationale?: Record<string, unknown>;
}

export class UpdateG5CapitalDecisionDto {
  id?: string;
  decisionType?: string;
  amount?: number;
  status?: string;
  rationale?: Record<string, unknown>;
}