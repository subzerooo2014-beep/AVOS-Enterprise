import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { OperationAlert } from "./unified-business-operations.types";
import { WorkflowOrchestratorService } from "./workflow-orchestrator.service";
import { EnterpriseAutomationService } from "./enterprise-automation.service";

@Injectable()
export class OperationsCommandCenterService {
  private readonly alerts = new Map<string, OperationAlert>();

  constructor(
    private readonly workflows: WorkflowOrchestratorService,
    private readonly automation: EnterpriseAutomationService,
  ) {}

  createAlert(
    input: Omit<OperationAlert, "id" | "resolved" | "createdAt" | "resolvedAt">,
  ): OperationAlert {
    const alert: OperationAlert = {
      ...input,
      id: randomUUID(),
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.set(alert.id, alert);
    return { ...alert };
  }

  resolveAlert(id: string): OperationAlert {
    const alert = this.requireAlert(id);
    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();
    this.alerts.set(id, alert);
    return { ...alert };
  }

  dashboard() {
    const alerts = Array.from(this.alerts.values());

    return {
      system: "AVOS Unified Business Operations Command Center",
      workflows: this.workflows.dashboard(),
      automation: this.automation.dashboard(),
      alerts: alerts.length,
      openAlerts: alerts.filter((item) => !item.resolved).length,
      criticalOpenAlerts: alerts.filter(
        (item) => item.severity === "CRITICAL" && !item.resolved,
      ).length,
      enterpriseHealth:
        alerts.some(
          (item) => item.severity === "CRITICAL" && !item.resolved,
        )
          ? "CRITICAL"
          : alerts.some(
                (item) =>
                  ["HIGH", "WARNING"].includes(item.severity) &&
                  !item.resolved,
              )
            ? "DEGRADED"
            : "HEALTHY",
      generatedAt: new Date().toISOString(),
    };
  }

  private requireAlert(id: string): OperationAlert {
    const alert = this.alerts.get(id);
    if (!alert) {
      throw new Error(`Operation alert not found: ${id}`);
    }
    return alert;
  }
}