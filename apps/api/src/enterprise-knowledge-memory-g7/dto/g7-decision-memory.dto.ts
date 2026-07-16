export class CreateG7DecisionMemoryDto {
  id!: string;
  decisionCode!: string;
  outcome!: string;
  createdAt!: string;
  context?: Record<string, unknown>;
}

export class UpdateG7DecisionMemoryDto {
  id?: string;
  decisionCode?: string;
  outcome?: string;
  createdAt?: string;
  context?: Record<string, unknown>;
}