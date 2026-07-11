export type CommandCenterStatus =
  | "normal"
  | "elevated"
  | "major_incident"
  | "critical_incident";

export type ChangeFreezeStatus =
  | "scheduled"
  | "active"
  | "expired"
  | "cancelled";

export type IncidentSeverity =
  | "sev1"
  | "sev2"
  | "sev3"
  | "sev4";

export type IncidentStatus =
  | "open"
  | "investigating"
  | "mitigated"
  | "resolved"
  | "closed";

export type EscalationStatus =
  | "pending"
  | "acknowledged"
  | "completed"
  | "failed";

export type OperationalDecision =
  | "continue_operations"
  | "monitor"
  | "freeze_changes"
  | "activate_command_center"
  | "escalate_incident"
  | "invoke_recovery"
  | "executive_notification";

export interface CommandCenterSession {
  id: string;
  name: string;
  status: CommandCenterStatus;
  reason: string;
  commander: string;
  participants: string[];
  startedAt: string;
  endedAt?: string;
  decisionIds: string[];
  incidentIds: string[];
}

export interface ChangeFreeze {
  id: string;
  name: string;
  reason: string;
  environment: string;
  status: ChangeFreezeStatus;
  startedAt: string;
  endsAt: string;
  createdBy: string;
  exceptionIds: string[];
  createdAt: string;
  cancelledAt?: string;
}

export interface ChangeFreezeException {
  id: string;
  freezeId: string;
  changeReference: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  decidedAt?: string;
}

export interface OperationalIncident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceName: string;
  environment: string;
  detectedAt: string;
  acknowledgedAt?: string;
  mitigatedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  owner: string;
  commander?: string;
  impactSummary: string;
  escalationIds: string[];
  timelineIds: string[];
}

export interface IncidentTimelineEntry {
  id: string;
  incidentId: string;
  eventType: string;
  message: string;
  actor: string;
  timestamp: string;
}

export interface EscalationRule {
  id: string;
  name: string;
  severity: IncidentSeverity;
  acknowledgeWithinMinutes: number;
  escalateAfterMinutes: number;
  targetRole: string;
  notifyExecutive: boolean;
  active: boolean;
  createdAt: string;
}

export interface IncidentEscalation {
  id: string;
  incidentId: string;
  ruleId: string;
  targetRole: string;
  status: EscalationStatus;
  triggeredAt: string;
  acknowledgedAt?: string;
  completedAt?: string;
  message: string;
}

export interface OperationalDecisionRecord {
  id: string;
  sessionId?: string;
  incidentId?: string;
  decision: OperationalDecision;
  reason: string;
  decidedBy: string;
  timestamp: string;
}

export interface ExecutiveReadinessReport {
  id: string;
  generatedAt: string;
  healthStatus: "healthy" | "degraded" | "critical";
  activeCommandCenters: number;
  activeChangeFreezes: number;
  openIncidents: number;
  criticalIncidents: number;
  pendingEscalations: number;
  unresolvedSev1: number;
  operationalReadinessScore: number;
  recommendations: string[];
}

export interface OperationalEvidenceEntry {
  id: string;
  sequence: number;
  eventType: string;
  entityType: string;
  entityId: string;
  actor: string;
  timestamp: string;
  payload: Record<string, unknown>;
  previousHash: string;
  hash: string;
}

export interface OperationalPlatformEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface OperationalSnapshot {
  generatedAt: string;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;
  commandCenterSessions: number;
  activeCommandCenters: number;
  changeFreezes: number;
  activeChangeFreezes: number;
  freezeExceptions: number;
  approvedFreezeExceptions: number;
  incidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  criticalIncidents: number;
  escalationRules: number;
  activeEscalationRules: number;
  escalations: number;
  completedEscalations: number;
  operationalDecisions: number;
  executiveReports: number;
  evidenceEntries: number;
  platformEvents: number;
}
