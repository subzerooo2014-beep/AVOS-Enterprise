export interface MetadataDefinition {
  id: string;
  code: string;
  status: string;
  active: boolean;
  score?: number;
  createdAt: string;
  metadata?: Record<string, unknown>;
}