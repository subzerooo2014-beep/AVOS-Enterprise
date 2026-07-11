export interface AvosDecisionInput<T = any> {
  event: string;
  entityType?: string;
  entityId?: string;
  payload?: T;
  metadata?: Record<string, any>;
}

export interface AvosDecision {
  accepted: boolean;
  confidence: number;
  workflow: string;
  actions: string[];
  reason: string;
}
