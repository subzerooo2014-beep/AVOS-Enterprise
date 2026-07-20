export type AgentStatus = 'registered' | 'active' | 'suspended' | 'retired';
export type TeamStatus = 'forming' | 'active' | 'blocked' | 'completed';
export type TaskStatus = 'created' | 'assigned' | 'in-progress' | 'blocked' | 'completed';

export interface AgentDefinitionInput {
  name: string;
  role: string;
  capabilities: string[];
  permissions: string[];
  projectIds?: string[];
  requestedBy: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  permissions: string[];
  projectIds: string[];
  status: AgentStatus;
  certified: boolean;
  certificationApprovedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamFormationInput {
  name: string;
  purpose: string;
  projectId: string;
  livingVisionId: string;
  requiredCapabilities: string[];
  requestedBy: string;
}

export interface DigitalTeam {
  id: string;
  name: string;
  purpose: string;
  projectId: string;
  livingVisionId: string;
  requiredCapabilities: string[];
  agentIds: string[];
  status: TeamStatus;
  requiresHumanApproval: true;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationTaskInput {
  teamId: string;
  title: string;
  description: string;
  requiredCapability: string;
  sensitive?: boolean;
  strategic?: boolean;
  requestedBy: string;
}

export interface OrganizationTask {
  id: string;
  teamId: string;
  title: string;
  description: string;
  requiredCapability: string;
  assignedAgentId?: string;
  sensitive: boolean;
  strategic: boolean;
  status: TaskStatus;
  humanEscalationRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId?: string;
  teamId: string;
  type: 'request' | 'response' | 'decision' | 'evidence' | 'escalation';
  content: string;
  createdAt: string;
}

export interface ConsensusInput {
  teamId: string;
  subject: string;
  options: string[];
  votes: Array<{
    agentId: string;
    option: string;
    confidence: number;
    rationale: string;
  }>;
}

export interface ConsensusResult {
  id: string;
  teamId: string;
  subject: string;
  selectedOption?: string;
  status: 'consensus' | 'conflict' | 'human-escalation';
  confidence: number;
  rationale: string;
  createdAt: string;
}

export interface TeamRetrospectiveInput {
  teamId: string;
  completedBy: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  lessons: string[];
  improvements: string[];
}

export interface TeamRetrospective {
  id: string;
  teamId: string;
  completedBy: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  lessons: string[];
  improvements: string[];
  publishedToLivingMemory: boolean;
  createdAt: string;
}

export interface Pack2Status {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Digital Organization & Multi-Agent Runtime';
  metrics: {
    agents: number;
    certifiedAgents: number;
    teams: number;
    activeTeams: number;
    tasks: number;
    completedTasks: number;
    messages: number;
    consensusRecords: number;
    humanEscalations: number;
    retrospectives: number;
  };
  controls: {
    organizationOS: true;
    humanFinalAuthority: true;
    certifiedAgentsOnly: true;
    capabilityBasedAssignment: true;
    secureInterAgentPermissions: true;
    sharedWorkingMemory: true;
    consensusAndConflictResolution: true;
    humanEscalation: true;
    teamRetrospectiveRequired: true;
    livingVisionAlignment: true;
  };
}