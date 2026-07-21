export type ApprovalState = 'not-required' | 'pending' | 'approved' | 'rejected';

export interface CloudNode {
  id: string;
  provider: 'local' | 'aws' | 'azure' | 'gcp' | 'private';
  region: string;
  zone: string;
  status: 'ready' | 'degraded' | 'offline';
  runtime: 'docker' | 'kubernetes';
  cpu: number;
  memoryGb: number;
  workloads: number;
  heartbeatAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  specialization: string;
  teamId: string;
  status: 'available' | 'working' | 'paused';
  authorityLevel: 'advisory' | 'operational' | 'strategic';
  tasksCompleted: number;
  confidence: number;
}

export interface AITeam {
  id: string;
  name: string;
  mission: string;
  agentIds: string[];
  status: 'active' | 'paused';
}

export interface GenesisProject {
  id: string;
  name: string;
  type: 'platform' | 'application' | 'digital-business' | 'service';
  objective: string;
  status:
    | 'planning'
    | 'awaiting-human-approval'
    | 'generating'
    | 'validating'
    | 'completed'
    | 'failed';
  approvalState: ApprovalState;
  blueprintVersion: string;
  generatedArtifacts: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionEvent {
  id: string;
  domain: 'cloud' | 'organization' | 'genesis' | 'governance';
  topic: string;
  severity: 'info' | 'warning' | 'critical';
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface EvolutionSnapshot {
  cloudNodes: CloudNode[];
  agents: AIAgent[];
  teams: AITeam[];
  genesisProjects: GenesisProject[];
  events: EvolutionEvent[];
  savedAt: string;
}