import { Injectable } from "@nestjs/common";
import { EnterpriseIncidentCommandService } from "./enterprise-incident-command.service";
import { EnterpriseReliabilitySnapshot } from "./enterprise-e4.types";

@Injectable()
export class EnterpriseReliabilityIntelligenceService {
  constructor(
    private readonly incidents: EnterpriseIncidentCommandService,
  ) {}

  snapshot(): EnterpriseReliabilitySnapshot {
    const active = this.incidents.active();
    const critical = active.filter(
      (incident) => incident.severity === "CRITICAL",
    ).length;

    const availability = Math.max(95, 99.99 - active.length * 0.1 - critical);
    const errorBudgetRemaining = Math.max(
      0,
      100 - active.length * 4 - critical * 15,
    );
    const recoveryReadiness = Math.max(
      0,
      100 - active.length * 3 - critical * 10,
    );

    return {
      availability: Number(availability.toFixed(2)),
      errorBudgetRemaining,
      activeIncidents: active.length,
      criticalIncidents: critical,
      recoveryReadiness,
      generatedAt: new Date().toISOString(),
    };
  }
}