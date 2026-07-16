export type NervousSignalSeverity =
  | "info"
  | "notice"
  | "warning"
  | "error"
  | "critical";

export type NervousSignalStatus =
  | "created"
  | "classified"
  | "routed"
  | "delivered"
  | "blocked"
  | "expired";

export type NervousSubscriptionStatus =
  | "active"
  | "paused"
  | "degraded"
  | "disabled";

export type NervousRouteDecision =
  | "deliver"
  | "throttle"
  | "block"
  | "require-human-approval";

export interface NervousSignalDefinition {
  id: string;
  name: string;
  description: string;
  domain: string;
  category: string;
  topic: string;
  severity: NervousSignalSeverity;
  schema: Record<string, unknown>;
  defaultHeaders: Record<string, string>;
  retentionHours: number;
  active: boolean;
  requiresTrace: boolean;
  requiresHumanApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NervousTopicTaxonomyNode {
  id: string;
  name: string;
  fullPath: string;
  parentId?: string;
  description: string;
  domain: string;
  level: number;
  childrenIds: string[];
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSubscriptionFilter {
  id: string;
  field: string;
  operator:
    | "eq"
    | "neq"
    | "contains"
    | "starts-with"
    | "ends-with"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "not-in";
  value: unknown;
  active: boolean;
}

export interface NervousSubscription {
  id: string;
  name: string;
  consumerId: string;
  topicPatterns: string[];
  signalDefinitionIds: string[];
  filters: NervousSubscriptionFilter[];
  priority: number;
  maxRatePerMinute: number;
  deliveryPolicyId: string;
  status: NervousSubscriptionStatus;
  requiresHumanApprovalForCritical: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NervousDeliveryPolicy {
  id: string;
  name: string;
  description: string;
  maxAttempts: number;
  retryBackoffMs: number;
  exponentialBackoff: boolean;
  deadLetterEnabled: boolean;
  timeoutMs: number;
  orderedDelivery: boolean;
  idempotencyRequired: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSignalEnvelope {
  id: string;
  definitionId: string;
  topic: string;
  sourceId: string;
  payload: unknown;
  headers: Record<string, string>;
  severity: NervousSignalSeverity;
  status: NervousSignalStatus;
  correlationId: string;
  traceId: string;
  causationId?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface NervousRouteTarget {
  subscriptionId: string;
  consumerId: string;
  decision: NervousRouteDecision;
  priority: number;
  reasons: string[];
  deliveryPolicyId: string;
}

export interface NervousRoutingResult {
  id: string;
  signalId: string;
  targets: NervousRouteTarget[];
  deliveredTargets: number;
  blockedTargets: number;
  throttledTargets: number;
  approvalTargets: number;
  correlationId: string;
  createdAt: string;
}

export interface NervousThrottleBucket {
  id: string;
  subscriptionId: string;
  windowStartedAt: string;
  consumed: number;
  limit: number;
  updatedAt: string;
}

export interface NervousFanoutBatch {
  id: string;
  signalId: string;
  targetSubscriptionIds: string[];
  completedSubscriptionIds: string[];
  failedSubscriptionIds: string[];
  status: "created" | "running" | "completed" | "partial" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface NervousRoutingHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    signalRegistryScore: number;
    taxonomyScore: number;
    subscriptionScore: number;
    policyScore: number;
    routingScore: number;
    throttlingScore: number;
    fanoutScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface NervousRoutingAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "signal"
    | "taxonomy"
    | "subscription"
    | "filter"
    | "policy"
    | "routing"
    | "throttling"
    | "fanout"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
