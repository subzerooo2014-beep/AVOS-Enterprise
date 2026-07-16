export interface FactoryBlueprint {
  id: string;
  code: string;
  title: string;
  version: string;
  active: boolean;
  definition?: Record<string, unknown>;
}