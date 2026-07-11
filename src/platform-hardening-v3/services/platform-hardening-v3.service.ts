import { Injectable } from "@nestjs/common";
import { AlertRuleService } from "./alert-rule.service";
import { IncidentRegistryService } from "./incident-registry.service";
import { RequestMetricsService } from "./request-metrics.service";

@Injectable()
export class PlatformHardeningV3Service {
  constructor(
    private readonly metrics:
      RequestMetricsService,
    private readonly incidents:
      IncidentRegistryService,
    private readonly alerts:
      AlertRuleService,
  ) {}

  getStatus() {
    return {
      success: true,
      system: "AVOS Platform Hardening",
      version: "v3",
      phase:
        "observability-and-incident-intelligence",
      environment:
        process.env.NODE_ENV ?? "development",
      capabilities: {
        globalRequestCorrelation: true,
        distributedTraceContext: true,
        structuredEnterpriseLogging: true,
        requestResponseMetrics: true,
        slowRequestDetection: true,
        errorClassification: true,
        operationalIncidentRegistry: true,
        failureFingerprinting: true,
        runtimeAlertRules: true,
        protectedDiagnostics: true,
      },
      configuration: {
        slowRequestThresholdMs: Number(
          process.env
            .AVOS_SLOW_REQUEST_THRESHOLD_MS ??
            750,
        ),
        diagnosticsProtection: true,
        diagnosticsHeader:
          "x-avos-diagnostics-token",
      },
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(
        process.uptime().toFixed(3),
      ),
    };
  }

  getOperationalSnapshot() {
    const metrics =
      this.metrics.getSnapshot();

    const alertRules =
      this.alerts.evaluateAll();

    return {
      success: true,
      system:
        "AVOS Enterprise Production",
      hardeningVersion: "v3",
      generatedAt:
        new Date().toISOString(),
      metrics,
      incidents:
        this.incidents.getSummary(),
      alerts: {
        total: alertRules.length,
        triggered: alertRules.filter(
          (item) =>
            item.status === "triggered",
        ).length,
        rules: alertRules,
      },
    };
  }
}
