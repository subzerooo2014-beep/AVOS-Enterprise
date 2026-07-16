export interface G8InnovationIdea {
  id: string;
  title: string;
  category: string;
  score: number;
  metadata?: Record<string, unknown>;
}