import { Injectable } from "@nestjs/common";
import { AccessDecisionService } from "./access-decision.service";
import { SecurityIncidentService } from "./security-incident.service";

@Injectable()
export class SecurityObservabilityService {
  constructor(
    private readonly decisions: AccessDecisionService,
    private readonly incidents: SecurityIncidentService,
  ) {}

  analytics() {
    const decisions = this.decisions.list();

    return {
      decisions: decisions.length,
      allowed: decisions.filter((item) => item.outcome === "ALLOW").length,
      denied: decisions.filter((item) => item.outcome === "DENY").length,
      reviews: decisions.filter((item) => item.outcome === "REVIEW").length,
      incidents: this.incidents.count(),
      openIncidents: this.incidents.openCount(),
      criticalIncidents: this.incidents
        .list()
        .filter((item) => item.severity === "CRITICAL").length,
    };
  }
}
