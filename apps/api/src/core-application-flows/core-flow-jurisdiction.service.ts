import { Injectable } from "@nestjs/common";
import type { FlowJurisdictionDecision } from "./core-flow-sovereignty.types";
import { CoreFlowSovereignZoneService } from "./core-flow-sovereign-zone.service";

@Injectable()
export class CoreFlowJurisdictionService {
  private readonly decisions: FlowJurisdictionDecision[] = [];

  constructor(private readonly zones: CoreFlowSovereignZoneService) {}

  evaluate(executionId: string, zoneId: string, dto: any = {}) {
    const zone = this.zones.findOne(zoneId);
    const reasons: string[] = [];
    let allowed = true;

    if (zone.status !== "active") {
      allowed = false;
      reasons.push(`zone-status-${zone.status}`);
    }

    if (
      dto?.requiredCountry &&
      String(dto.requiredCountry) !== zone.country
    ) {
      allowed = false;
      reasons.push("country-mismatch");
    }

    if (
      dto?.requiredResidencyPolicy &&
      String(dto.requiredResidencyPolicy) !== zone.residencyPolicy
    ) {
      allowed = false;
      reasons.push("residency-policy-mismatch");
    }

    if (Boolean(dto?.restrictedData) && zone.residencyPolicy !== "in-country") {
      allowed = false;
      reasons.push("restricted-data-residency-violation");
    }

    if (reasons.length === 0) {
      reasons.push("jurisdiction-requirements-satisfied");
    }

    const decision: FlowJurisdictionDecision = {
      id: `jurisdiction_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      zoneId,
      allowed,
      reasons,
      decidedAt: new Date().toISOString(),
    };

    this.decisions.push(decision);
    return { decision, zone };
  }

  findAll(executionId?: string) {
    return this.decisions
      .filter((item) => !executionId || item.executionId === executionId)
      .slice()
      .reverse();
  }
}
