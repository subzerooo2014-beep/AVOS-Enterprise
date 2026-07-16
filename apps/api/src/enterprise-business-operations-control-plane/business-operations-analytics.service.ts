import { Injectable } from "@nestjs/common";
import { BusinessKpiRegistryService } from "./business-kpi-registry.service";
import { BusinessProcessOrchestratorService } from "./business-process-orchestrator.service";
import { BusinessSlaMonitorService } from "./business-sla-monitor.service";

@Injectable()
export class BusinessOperationsAnalyticsService {
  constructor(
    private readonly kpis: BusinessKpiRegistryService,
    private readonly processes: BusinessProcessOrchestratorService,
    private readonly sla: BusinessSlaMonitorService,
  ) {}

  snapshot() {
    const measurements = this.kpis.measurementsList();
    const processes = this.processes.list();

    return {
      kpiMeasurements: measurements.length,
      healthyKpis: measurements.filter((item) => item.status === "HEALTHY")
        .length,
      warningKpis: measurements.filter((item) => item.status === "WARNING")
        .length,
      criticalKpis: measurements.filter((item) => item.status === "CRITICAL")
        .length,
      processes: processes.length,
      runningProcesses: processes.filter((item) => item.status === "RUNNING")
        .length,
      completedProcesses: processes.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      failedProcesses: processes.filter((item) => item.status === "FAILED")
        .length,
      slaBreaches: this.sla.breachCount(),
    };
  }
}
