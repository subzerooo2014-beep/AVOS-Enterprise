import {
  V5IncidentRule,
  V5OperationsService,
  V5Runbook,
} from "./contracts";

export class V5RunbookGenerator {
  generate(
    services: readonly V5OperationsService[],
    incidents: readonly V5IncidentRule[],
  ): V5Runbook[] {
    return incidents.map((incident) => {
      const service = services.find(
        (item) => item.key === incident.serviceKey,
      );

      return {
        key: `runbook.${incident.key}`,
        serviceKey: incident.serviceKey,
        trigger: incident.key,
        steps: [
          "capture current health snapshot",
          "collect recent logs and traces",
          "verify dependency health",
          "apply safe remediation",
          "validate recovery",
          "record operational evidence",
        ],
        requiresApproval:
          incident.severity === "critical" &&
          service?.criticality === "high",
      };
    });
  }
}
