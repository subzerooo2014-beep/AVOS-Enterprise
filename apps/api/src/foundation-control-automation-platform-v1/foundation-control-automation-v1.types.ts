export interface FoundationEventV1 {
  id: string;
  topic: string;
  version: number;
  payload: Record<string, unknown>;
  status: "PUBLISHED" | "DELIVERED" | "FAILED" | "DEAD_LETTER";
  createdAt: string;
}

export interface FoundationWorkflowV1 {
  id: string;
  name: string;
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "FAILED";
  steps: string[];
  currentStepIndex: number;
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface FoundationRuleV1 {
  id: string;
  name: string;
  field: string;
  operator: "EQ" | "NEQ" | "GT" | "GTE" | "LT" | "LTE" | "IN";
  expected: unknown;
  enabled: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationPolicyV1 {
  id: string;
  name: string;
  effect: "ALLOW" | "DENY";
  subject: string;
  action: string;
  resource: string;
  conditions: Record<string, unknown>;
  enabled: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationIdentityV1 {
  id: string;
  username: string;
  roles: string[];
  attributes: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationConfigurationV1 {
  key: string;
  value: unknown;
  environment: string;
  version: number;
  updatedAt: string;
}

export interface FoundationSecretV1 {
  key: string;
  encryptedValue: string;
  version: number;
  rotatedAt: string;
}

export interface FoundationScheduledJobV1 {
  id: string;
  name: string;
  schedule: string;
  status: "READY" | "RUNNING" | "COMPLETED" | "FAILED" | "DISABLED";
  payload: Record<string, unknown>;
  lastRunAt?: string;
  updatedAt: string;
}

export interface FoundationNotificationV1 {
  id: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "IN_APP" | "WEBHOOK";
  recipient: string;
  subject: string;
  message: string;
  status: "QUEUED" | "SENT" | "FAILED";
  createdAt: string;
  sentAt?: string;
}

export interface FoundationControlMetricsV1 {
  events: number;
  deadLetters: number;
  workflows: number;
  runningWorkflows: number;
  rules: number;
  policies: number;
  identities: number;
  configurations: number;
  secrets: number;
  jobs: number;
  notifications: number;
}

export interface FoundationControlStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: FoundationControlMetricsV1;
  components: Record<string, string>;
}
