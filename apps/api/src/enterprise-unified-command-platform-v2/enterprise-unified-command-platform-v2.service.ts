import { Injectable } from "@nestjs/common";
import { CommandApprovalV2Service } from "./command-approval-v2.service";
import { CommandSourceRegistryV2Service } from "./command-source-registry-v2.service";
import { ExecutiveCockpitV2Service } from "./executive-cockpit-v2.service";
import { GlobalMonitoringV2Service } from "./global-monitoring-v2.service";
import { UnifiedCommandOrchestratorV2Service } from "./unified-command-orchestrator-v2.service";
import type {
  UnifiedCommandHealthV2,
  UnifiedCommandMetricsV2,
} from "./unified-command-v2.types";

@Injectable()
export class EnterpriseUnifiedCommandPlatformV2Service {
  constructor(
    private readonly sources: CommandSourceRegistryV2Service,
    private readonly commands: UnifiedCommandOrchestratorV2Service,
    private readonly approvals: CommandApprovalV2Service,
    private readonly monitoring: GlobalMonitoringV2Service,
    private readonly cockpit: ExecutiveCockpitV2Service,
  ) {}

  metrics(): UnifiedCommandMetricsV2 {
    return {
      sources: this.sources.count(),
      onlineSources: this.sources.onlineCount(),
      commands: this.commands.count(),
      executingCommands: this.commands.executingCount(),
      completedCommands: this.commands.completedCount(),
      failedCommands: this.commands.failedCount(),
      pendingApprovals: this.approvals.pendingCount(),
      signals: this.monitoring.count(),
      criticalSignals: this.monitoring.criticalCount(),
      executiveMetrics: this.cockpit.count(),
    };
  }

  health(): UnifiedCommandHealthV2 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Unified Command Platform V2",
      version: "2.0.0",
      status:
        metrics.failedCommands > 0 ||
        metrics.criticalSignals > 0 ||
        metrics.pendingApprovals > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        unifiedCommandCenter: "READY",
        enterpriseControlPlane: "READY",
        crossPlatformOperations: "READY",
        executiveCockpit: "READY",
        globalMonitoring: "READY",
        unifiedAnalytics: "READY",
        enterpriseDashboard: "READY",
      },
    };
  }

  dashboard() {
    return {
      success: true,
      health: this.health(),
      sources: this.sources.list(),
      commands: this.commands.list(),
      approvals: this.approvals.list(),
      signals: this.monitoring.list(),
      executiveMetrics: this.cockpit.list(),
    };
  }
}
