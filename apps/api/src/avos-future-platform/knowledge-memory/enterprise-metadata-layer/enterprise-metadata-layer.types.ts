export type EnterpriseMetadataLayerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseMetadataLayerCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseMetadataLayerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}