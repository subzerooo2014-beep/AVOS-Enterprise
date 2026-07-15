export const ENTERPRISE_AI_OPERATIONS_CAPABILITIES = [
  'ai-operations-engine',
  'autonomous-workflow-engine',
  'enterprise-automation-engine',
  'intelligent-task-orchestrator',
  'ai-decision-execution-engine',
  'ai-process-optimization-engine',
  'workflow-designer-engine',
  'event-driven-automation-engine',
  'human-approval-engine',
  'enterprise-agent-manager',
  'multi-agent-collaboration-engine',
  'agent-task-routing-engine',
  'operations-intelligence-engine',
  'sla-operational-risk-engine',
  'predictive-operations-engine',
  'decision-explainability-engine',
  'operations-center-dashboard',
  'ai-operations-orchestrator',
] as const;

export type EnterpriseAiOperationsCapability =
  (typeof ENTERPRISE_AI_OPERATIONS_CAPABILITIES)[number];

export type WorkflowStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: number;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  triggers: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'task' | 'decision' | 'approval' | 'agent' | 'event';
  dependsOn: string[];
  timeoutSeconds: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startedAt: string;
  completedAt?: string;
  completedSteps: string[];
  failedSteps: string[];
}

export interface AiTask {
  id: string;
  type: string;
  priority: number;
  requiredCapabilities: string[];
  status: 'queued' | 'assigned' | 'running' | 'completed' | 'failed';
}

export interface EnterpriseAgent {
  id: string;
  name: string;
  capabilities: string[];
  active: boolean;
  currentLoad: number;
  successRate: number;
}

export interface DecisionExecution {
  id: string;
  decisionType: string;
  recommendation: string;
  confidence: number;
  approved: boolean;
  executed: boolean;
  explanation: string[];
}

export interface OperationalMetric {
  id: string;
  process: string;
  throughput: number;
  latencyMs: number;
  errorRate: number;
  slaTargetMs: number;
}

export interface AiOperationsDashboardSnapshot {
  generatedAt: string;
  activeWorkflows: number;
  queuedTasks: number;
  activeAgents: number;
  automationRate: number;
  slaCompliance: number;
  decisionExecutionRate: number;
  capabilityStatus: Record<
    EnterpriseAiOperationsCapability,
    'operational'
  >;
}