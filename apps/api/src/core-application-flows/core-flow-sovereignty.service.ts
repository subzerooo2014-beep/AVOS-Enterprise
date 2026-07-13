import { Injectable } from "@nestjs/common";
import { CoreFlowSovereignZoneService } from "./core-flow-sovereign-zone.service";
import { CoreFlowJurisdictionService } from "./core-flow-jurisdiction.service";
import { CoreFlowKeyManagementService } from "./core-flow-key-management.service";
import { CoreFlowContinuityService } from "./core-flow-continuity.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowSovereigntyService {
  constructor(
    private readonly zones: CoreFlowSovereignZoneService,
    private readonly jurisdiction: CoreFlowJurisdictionService,
    private readonly keys: CoreFlowKeyManagementService,
    private readonly continuity: CoreFlowContinuityService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  authorize(executionId: string, dto: any = {}) {
    const evaluation = this.jurisdiction.evaluate(
      executionId,
      String(dto?.zoneId),
      dto,
    );

    const audit = this.audit.write(
      executionId,
      "sovereignty.authorized",
      {
        zoneId: dto?.zoneId,
        allowed: evaluation.decision.allowed,
        reasons: evaluation.decision.reasons,
      },
      String(dto?.actor ?? "system"),
    );

    return {
      ...evaluation,
      audit,
      authorizedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      zones: this.zones.dashboard(),
      keys: this.keys.findAll(),
      continuityPlans: this.continuity.findAll(),
      jurisdictionDecisions: this.jurisdiction.findAll().slice(0, 50),
      generatedAt: new Date().toISOString(),
    };
  }
}
