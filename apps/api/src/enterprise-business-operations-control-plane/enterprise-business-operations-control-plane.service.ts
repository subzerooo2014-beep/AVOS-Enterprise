import { Injectable } from "@nestjs/common";
import { BusinessCatalogService } from "./business-catalog.service";
import { BusinessKpiRegistryService } from "./business-kpi-registry.service";
import { BusinessOperationsAnalyticsService } from "./business-operations-analytics.service";
import { BusinessOperationsGovernanceService } from "./business-operations-governance.service";
import { BusinessProcessOrchestratorService } from "./business-process-orchestrator.service";
import { BusinessRulesCenterService } from "./business-rules-center.service";
import { BusinessSlaMonitorService } from "./business-sla-monitor.service";
import type {
  BusinessOperationsHealth,
  BusinessOperationsMetrics,
} from "./enterprise-business-operations.types";

@Injectable()
export class EnterpriseBusinessOperationsControlPlaneService {
  constructor(
    private readonly catalog: BusinessCatalogService,
    private readonly kpis: BusinessKpiRegistryService,
    private readonly rules: BusinessRulesCenterService,
    private readonly processes: BusinessProcessOrchestratorService,
    private readonly sla: BusinessSlaMonitorService,
    private readonly analytics: BusinessOperationsAnalyticsService,
    private readonly governance: BusinessOperationsGovernanceService,
  ) {}

  metrics(): BusinessOperationsMetrics {
    const analytics = this.analytics.snapshot();

    return {
      components: this.catalog.count(),
      kpis: this.kpis.definitionCount(),
      measurements: this.kpis.measurementCount(),
      healthyKpis: analytics.healthyKpis,
      warningKpis: analytics.warningKpis,
      criticalKpis: analytics.criticalKpis,
      rules: this.rules.count(),
      processes: this.processes.count(),
      runningProcesses: analytics.runningProcesses,
      completedProcesses: analytics.completedProcesses,
      failedProcesses: analytics.failedProcesses,
      slaDefinitions: this.sla.definitionCount(),
      slaBreaches: analytics.slaBreaches,
    };
  }

  health(): BusinessOperationsHealth {
    const governance = this.governance.validate();

    return {
      success: true,
      system: "AVOS Enterprise Business Operations Control Plane",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics: this.metrics(),
      components: {
        discovery: "READY",
        catalog: "READY",
        kpiRegistry: "READY",
        businessRulesCenter: "READY",
        processOrchestrator: "READY",
        slaMonitor: "READY",
        operationalAnalytics: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
        salesIntegration: "INTEGRATION_READY",
        inventoryIntegration: "INTEGRATION_READY",
        customerIntegration: "INTEGRATION_READY",
        financeIntegration: "INTEGRATION_READY",
        orderIntegration: "INTEGRATION_READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      catalog: this.catalog.status(),
      kpiDefinitions: this.kpis.definitionsList(),
      kpiMeasurements: this.kpis.measurementsList(),
      rules: this.rules.list(),
      processes: this.processes.list(),
      slaDefinitions: this.sla.definitionsList(),
      slaMeasurements: this.sla.measurementsList(),
      analytics: this.analytics.snapshot(),
      governance: this.governance.validate(),
    };
  }
}
