export type LivingBlueprintSynchronizerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface LivingBlueprintSynchronizerCapability {
  id: string;
  name: string;
  group: string;
  status: LivingBlueprintSynchronizerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}