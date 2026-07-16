export interface G7DecisionMemory {
  id: string;
  decisionCode: string;
  outcome: string;
  createdAt: string;
  context?: Record<string, unknown>;
}