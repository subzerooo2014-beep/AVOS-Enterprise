export interface ArchitectureStandard {
  id: string;
  code: string;
  status: string;
  active: boolean;
  score?: number;
  createdAt: string;
  metadata?: Record<string, unknown>;
}