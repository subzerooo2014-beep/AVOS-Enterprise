export type LifecycleCommand =
  | "start"
  | "stop"
  | "restart"
  | "enter-maintenance"
  | "exit-maintenance"
  | "recover"
  | "diagnose";

export type RuntimeState =
  | "registered"
  | "starting"
  | "running"
  | "degraded"
  | "maintenance"
  | "stopping"
  | "stopped"
  | "failed"
  | "recovering";

export interface ServiceRuntimeRecord {
  readonly serviceId: string;
  readonly state: RuntimeState;
  readonly previousState?: RuntimeState;
  readonly lastCommand?: LifecycleCommand;
  readonly lastHeartbeatAt?: string;
  readonly lastStateChangeAt: string;
  readonly restartCount: number;
  readonly failureCount: number;
  readonly recoveryCount: number;
  readonly maintenanceReason?: string;
  readonly diagnostics: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface LifecycleCommandRecord {
  readonly id: string;
  readonly serviceId: string;
  readonly command: LifecycleCommand;
  readonly actorId: string;
  readonly requestedAt: string;
  readonly completedAt: string;
  readonly status: "completed" | "rejected" | "failed";
  readonly fromState: RuntimeState;
  readonly toState: RuntimeState;
  readonly reason?: string;
  readonly details: Readonly<Record<string, unknown>>;
}

export interface ServiceHeartbeat {
  readonly id: string;
  readonly serviceId: string;
  readonly status: "healthy" | "degraded" | "unhealthy";
  readonly latencyMs: number;
  readonly reportedAt: string;
  readonly details: Readonly<Record<string, unknown>>;
}

export interface ServiceFailureRecord {
  readonly id: string;
  readonly serviceId: string;
  readonly code: string;
  readonly message: string;
  readonly severity: "warning" | "error" | "critical";
  readonly detectedAt: string;
  readonly resolvedAt?: string;
  readonly details: Readonly<Record<string, unknown>>;
}