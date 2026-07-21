export interface UltimateProductRequest {
  name?: string;
  description?: string;
  entities?: string[];
  capabilities?: string[];
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}