export type WorkflowStatus =
  | 'draft'
  | 'awaiting-approval'
  | 'approved'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'rolled-back';

export type WorkflowStepStatus =
  | 'pending'
  | 'ready'
  | 'running'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'rolled-back';

export interface WorkflowStepInput {
  name: string;
  capability: string;
  description: string;
  dependsOn?: string[];
  requiresHumanApproval?: boolean;
  maxRetries?: number;
  estimatedCost?: number;
}

export interface WorkflowCreateInput {
  projectId: string;
  livingVisionId: string;
  teamId: string;
  goal: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  strategic?: boolean;
  sensitive?: boolean;
  steps?: WorkflowStepInput[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  capability: string;
  description: string;
  dependsOn: string[];
  assignedAgentId?: string;
  status: WorkflowStepStatus;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  maxRetries: number;
  retryCount: number;
  estimatedCost: number;
  actualCost: number;
  checkpointId?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Workflow {
  id: string;
  projectId: string;
  livingVisionId: string;
  teamId: string;
  goal: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  strategic: boolean;
  sensitive: boolean;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  currentStepIds: string[];
  humanApprovalRequired: boolean;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ExecutionCheckpoint {
  id: string;
  workflowId: string;
  stepId?: string;
  state: unknown;
  reason: string;
  createdAt: string;
}

export interface ExecutionEvent {
  id: string;
  workflowId: string;
  stepId?: string;
  type:
    | 'workflow-created'
    | 'workflow-approved'
    | 'workflow-started'
    | 'step-started'
    | 'step-completed'
    | 'step-failed'
    | 'retry-scheduled'
    | 'checkpoint-created'
    | 'workflow-completed'
    | 'workflow-rolled-back'
    | 'human-escalation';
  message: string;
  createdAt: string;
}

export interface Pack3Status {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Autonomous Execution & Workflow Runtime';
  metrics: {
    workflows: number;
    runningWorkflows: number;
    completedWorkflows: number;
    failedWorkflows: number;
    steps: number;
    completedSteps: number;
    failedSteps: number;
    checkpoints: number;
    retries: number;
    humanEscalations: number;
    totalEstimatedCost: number;
    totalActualCost: number;
  };
  controls: {
    governanceBeforeExecution: true;
    organizationBeforeExecution: true;
    certifiedAgentsOnly: true;
    humanFinalAuthority: true;
    humanApprovalCheckpoints: true;
    livingVisionAlignment: true;
    checkpointRecovery: true;
    retryAndRecovery: true;
    rollbackSupport: true;
    executionObservability: true;
    costTracking: true;
    noUnapprovedStrategicExecution: true;
  };
}