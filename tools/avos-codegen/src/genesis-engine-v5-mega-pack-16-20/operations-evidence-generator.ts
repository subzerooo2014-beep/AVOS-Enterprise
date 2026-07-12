import { V5OperationsService } from "./contracts";

export interface V5OperationalEvidenceDefinition {
  key: string;
  serviceKey: string;
  requiredFields: string[];
  retentionDays: number;
}

export interface V5AlertRoute {
  severity: "warning" | "critical";
  channel: string;
  escalationMinutes: number;
}

export interface V5OperationsTestPlan {
  incidentTests: string[];
  remediationTests: string[];
  rollbackTests: string[];
  capacityTests: string[];
}

export class V5OperationsEvidenceGenerator {
  evidence(
    services: readonly V5OperationsService[],
  ): V5OperationalEvidenceDefinition[] {
    return services.flatMap((service) => [
      {
        key: `${service.key}.incident-evidence`,
        serviceKey: service.key,
        requiredFields: [
          "incidentId",
          "detectedAt",
          "severity",
          "healthSnapshot",
          "correlationId",
        ],
        retentionDays: 730,
      },
      {
        key: `${service.key}.remediation-evidence`,
        serviceKey: service.key,
        requiredFields: [
          "actionId",
          "action",
          "approvedBy",
          "startedAt",
          "completedAt",
          "result",
        ],
        retentionDays: 730,
      },
    ]);
  }

  alertRoutes(): V5AlertRoute[] {
    return [
      {
        severity: "warning",
        channel: "operations-channel",
        escalationMinutes: 30,
      },
      {
        severity: "critical",
        channel: "incident-command-center",
        escalationMinutes: 5,
      },
    ];
  }

  tests(): V5OperationsTestPlan {
    return {
      incidentTests: [
        "availability breach creates incident",
        "latency breach creates incident",
        "dependency failure is correlated",
      ],
      remediationTests: [
        "safe remediation executes",
        "unsafe remediation requires approval",
        "failed remediation records evidence",
      ],
      rollbackTests: [
        "bad release triggers rollback",
        "rollback target is previous release",
        "recovery verification completes",
      ],
      capacityTests: [
        "high load scales out",
        "low load scales in",
        "replica bounds are enforced",
      ],
    };
  }
}
