export class CreateG10ExecutiveDecisionDto {
  id!: string;
  decisionType!: string;
  priority!: number;
  approved!: boolean;
  context?: Record<string, unknown>;
}

export class UpdateG10ExecutiveDecisionDto {
  id?: string;
  decisionType?: string;
  priority?: number;
  approved?: boolean;
  context?: Record<string, unknown>;
}