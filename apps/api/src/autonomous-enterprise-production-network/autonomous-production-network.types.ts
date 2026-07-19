export interface NetworkNode {
  id: string;
  factoryNamespace: string;
  nodeType: 'factory' | 'coordination-hub' | 'certification-node';
  status: 'online' | 'degraded' | 'offline';
  region: string;
  capabilities: string[];
  currentLoad: number;
  capacity: number;
  healthScore: number;
  registeredAt: string;
  updatedAt: string;
}

export interface NetworkWorkload {
  id: string;
  objective: string;
  requiredCapabilities: string[];
  priority: number;
  jurisdictions: string[];
  status:
    | 'submitted'
    | 'planned'
    | 'routed'
    | 'executing'
    | 'completed'
    | 'awaiting-human-approval'
    | 'failed';
  assignedNodes: string[];
  routingDecisionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutingDecision {
  id: string;
  workloadId: string;
  selectedNodes: Array<{
    nodeId: string;
    factoryNamespace: string;
    score: number;
    reasons: string[];
  }>;
  strategy: 'capability-first' | 'balanced' | 'resilience-first';
  confidence: number;
  requiresHumanApproval: boolean;
  createdAt: string;
}

export interface NetworkCoordinationPlan {
  id: string;
  workloadId: string;
  stages: Array<{
    sequence: number;
    nodeId: string;
    action: string;
    dependencies: number[];
  }>;
  sharedContext: string[];
  auditTrailEnabled: true;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface ResilienceEvent {
  id: string;
  nodeId: string;
  eventType: 'degradation' | 'failure' | 'recovery' | 'reroute';
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken: string;
  affectedWorkloads: string[];
  rollbackReady: true;
  createdAt: string;
}

export interface NetworkGovernanceDecision {
  id: string;
  subjectType: 'workload' | 'node' | 'network-change';
  subjectId: string;
  decision: 'approve' | 'reject' | 'hold';
  approvedBy: string;
  reason: string;
  globalComplianceReadinessGate: true;
  humanFinalAuthority: true;
  createdAt: string;
}
