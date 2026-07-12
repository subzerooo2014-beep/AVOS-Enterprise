import {
  V5OperationsInput,
  V5RemediationAction,
} from "./contracts";

export class V5RemediationGenerator {
  generate(
    input: V5OperationsInput,
  ): V5RemediationAction[] {
    if (input.enableAutoRemediation === false) return [];

    return input.services.flatMap((service) => [
      {
        key: `${service.key}.restart-unhealthy-instance`,
        serviceKey: service.key,
        action: "restart unhealthy instance",
        safeToAutomate: true,
        rollbackAction: "restore previous healthy instance",
      },
      {
        key: `${service.key}.scale-out`,
        serviceKey: service.key,
        action: "increase replica count",
        safeToAutomate: true,
        rollbackAction: "restore previous replica count",
      },
      {
        key: `${service.key}.traffic-shift`,
        serviceKey: service.key,
        action: "shift traffic away from degraded instances",
        safeToAutomate: service.criticality !== "high",
        rollbackAction: "restore original traffic distribution",
      },
    ]);
  }
}
