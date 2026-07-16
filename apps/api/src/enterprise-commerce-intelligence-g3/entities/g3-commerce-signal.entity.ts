export interface G3CommerceSignal {
  id: string;
  marketCode: string;
  signalType: string;
  score: number;
  metadata?: Record<string, unknown>;
}