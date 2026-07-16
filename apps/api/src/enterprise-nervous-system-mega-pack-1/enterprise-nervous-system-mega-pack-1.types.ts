export type NervousSystemEventPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type NervousSystemDeliveryStatus =
  | "pending"
  | "delivering"
  | "delivered"
  | "retrying"
  | "failed"
  | "dead-lettered";

export type NervousSystemConsumerStatus =
  | "active"
  | "paused"
  | "degraded"
  | "offline";

export interface NervousSystemEventContract {
  id: string;
  name: string;
  version: string;
  topic: string;
  description: string;
  payloadSchema: Record<string, unknown>;
  requiredHeaders: string[];
  producerIds: string[];
  consumerIds: string[];
  active: boolean;
  traceable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSystemTopic {
  id: string;
  name: string;
  description: string;
  partitions: number;
  retentionHours: number;
  durable: boolean;
  ordered: boolean;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSystemProducer {
  id: string;
  name: string;
  serviceId: string;
  allowedTopics: string[];
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSystemConsumer {
  id: string;
  name: string;
  serviceId: string;
  subscribedTopics: string[];
  maxConcurrency: number;
  currentConcurrency: number;
  status: NervousSystemConsumerStatus;
  requiresHumanApprovalForCritical: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSystemEventEnvelope {
  id: string;
  contractId: string;
  topic: string;
  producerId: string;
  key?: string;
  payload: unknown;
  headers: Record<string, string>;
  priority: NervousSystemEventPriority;
  correlationId: string;
  causationId?: string;
  traceId: string;
  sequence: number;
  createdAt: string;
}

export interface NervousSystemDelivery {
  id: string;
  eventId: string;
  consumerId: string;
  attempt: number;
  maxAttempts: number;
  status: NervousSystemDeliveryStatus;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSystemDeadLetter {
  id: string;
  eventId: string;
  consumerId: string;
  deliveryId: string;
  reason: string;
  payloadSnapshot: unknown;
  replayed: boolean;
  replayedAt?: string;
  createdAt: string;
}

export interface NervousSystemCorrelationTrace {
  id: string;
  correlationId: string;
  traceId: string;
  eventIds: string[];
  deliveryIds: string[];
  failedDeliveryIds: string[];
  startedAt: string;
  updatedAt: string;
}

export interface NervousSystemHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    contractsScore: number;
    topicsScore: number;
    producersScore: number;
    consumersScore: number;
    deliveryScore: number;
    retryScore: number;
    deadLetterScore: number;
    traceScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface NervousSystemAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "contract"
    | "topic"
    | "producer"
    | "consumer"
    | "event"
    | "routing"
    | "delivery"
    | "retry"
    | "dead-letter"
    | "trace"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
