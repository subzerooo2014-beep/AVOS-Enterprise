import {
  V5CapacityDecision,
  V5OperationsInput,
} from "./contracts";

export interface V5RollbackPolicy {
  serviceKey: string;
  enabled: boolean;
  trigger: string;
  target: "previous-release";
  verificationWindowMinutes: number;
}

export interface V5ResiliencePolicy {
  serviceKey: string;
  timeoutMs: number;
  retryAttempts: number;
  circuitBreakerThreshold: number;
  bulkheadEnabled: boolean;
}

export class V5ResilienceGenerator {
  capacity(
    input: V5OperationsInput,
  ): V5CapacityDecision[] {
    if (input.enableCapacityAutomation === false) return [];

    return input.services.map((service) => ({
      serviceKey: service.key,
      metric: "cpu_utilization_percent",
      scaleOutThreshold: 70,
      scaleInThreshold: 35,
      minReplicas: service.criticality === "high" ? 3 : 1,
      maxReplicas: service.criticality === "high" ? 20 : 10,
    }));
  }

  rollback(
    input: V5OperationsInput,
  ): V5RollbackPolicy[] {
    return input.services.map((service) => ({
      serviceKey: service.key,
      enabled: input.enableRollback !== false,
      trigger:
        "post_deploy_error_rate > baseline_error_rate * 2",
      target: "previous-release",
      verificationWindowMinutes: 10,
    }));
  }

  policies(
    input: V5OperationsInput,
  ): V5ResiliencePolicy[] {
    return input.services.map((service) => ({
      serviceKey: service.key,
      timeoutMs: service.criticality === "high" ? 3000 : 5000,
      retryAttempts: 3,
      circuitBreakerThreshold: 50,
      bulkheadEnabled: true,
    }));
  }
}
