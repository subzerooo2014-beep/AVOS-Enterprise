export interface FactoryGenerationJob {
  id: string;
  blueprintCode: string;
  status: string;
  priority: number;
  createdAt: string;
  completedAt?: string;
}