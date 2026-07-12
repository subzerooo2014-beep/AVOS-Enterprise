import {
  V5IncidentRule,
  V5OperationsService,
} from "./contracts";

export class V5IncidentDetectionGenerator {
  generate(
    services: readonly V5OperationsService[],
  ): V5IncidentRule[] {
    return services.flatMap((service) => [
      {
        key: `${service.key}.availability-breach`,
        serviceKey: service.key,
        severity: "critical" as const,
        condition: "availability_burn_rate > 2",
        evaluationWindowMinutes: 5,
      },
      {
        key: `${service.key}.latency-breach`,
        serviceKey: service.key,
        severity:
          service.criticality === "high"
            ? "critical" as const
            : "warning" as const,
        condition: "p95_latency_ms > latency_slo_ms",
        evaluationWindowMinutes: 10,
      },
      {
        key: `${service.key}.dependency-failure`,
        serviceKey: service.key,
        severity: "warning" as const,
        condition: "dependency_error_rate > 5",
        evaluationWindowMinutes: 5,
      },
    ]);
  }
}
