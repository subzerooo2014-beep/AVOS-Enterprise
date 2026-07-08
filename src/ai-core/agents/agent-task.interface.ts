export interface AgentTask {
  id: string;
  goal: string;
  priority: number;
  tools: string[];
}
