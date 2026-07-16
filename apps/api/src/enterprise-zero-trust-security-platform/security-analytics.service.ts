import { Injectable } from "@nestjs/common";
import { AuditCenterService } from "./audit-center.service";
import { AuthorizationCenterService } from "./authorization-center.service";
import { ThreatDetectionService } from "./threat-detection.service";

@Injectable()
export class SecurityAnalyticsService {
  constructor(
    private readonly authorization: AuthorizationCenterService,
    private readonly audits: AuditCenterService,
    private readonly threats: ThreatDetectionService,
  ) {}

  snapshot() {
    const decisions = this.authorization.decisionsList();

    return {
      decisions: decisions.length,
      allowed: decisions.filter((item) => item.outcome === "ALLOW").length,
      denied: decisions.filter((item) => item.outcome === "DENY").length,
      reviews: decisions.filter((item) => item.outcome === "REVIEW").length,
      audits: this.audits.count(),
      threats: this.threats.count(),
      openThreats: this.threats.openCount(),
      criticalThreats: this.threats
        .list()
        .filter((item) => item.severity === "CRITICAL").length,
    };
  }
}
