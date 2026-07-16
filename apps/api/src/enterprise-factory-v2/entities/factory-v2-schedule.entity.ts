export interface FactoryV2Schedule {
  id: string;
  blueprintCode: string;
  cron: string;
  active: boolean;
  metadata?: Record<string, unknown>;
}