export interface FactoryV3Worker {
  id: string;
  name: string;
  status: string;
  capacity: number;
  lastHeartbeat?: string;
  capabilities?: Record<string, unknown>;
}