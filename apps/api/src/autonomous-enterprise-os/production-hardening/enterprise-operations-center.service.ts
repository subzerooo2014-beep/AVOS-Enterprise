import { Injectable } from "@nestjs/common";
import { EnterpriseTelemetryService } from "./enterprise-telemetry.service";
import { OperationalInsightsService } from "./operational-insights.service";
import { UnifiedOperationalTimelineService } from "./unified-operational-timeline.service";

@Injectable()
export class EnterpriseOperationsCenterService {
  constructor(
    private readonly telemetry: EnterpriseTelemetryService,
    private readonly insights: OperationalInsightsService,
    private readonly timeline: UnifiedOperationalTimelineService,
  ) {}

  status() {
    const insight = this.insights.generate();
    return {
      name: "AVOS Autonomous Enterprise OS — Production Hardening & Operational Intelligence",
      version: "AEOS-1.1.0",
      status: insight.unhealthySignals > 0 ? "degraded" : "operational",
      telemetrySignals: this.telemetry.count(),
      latestInsight: insight,
      productionHardening: "operational",
      operationalIntelligence: "operational",
      autonomousCoordination: "operational",
      enterpriseOperationsCenter: "operational",
      certificationLayer: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      capturedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      status: this.status(),
      timeline: this.timeline.recent(20),
      telemetry: this.telemetry.recent(20),
    };
  }
}