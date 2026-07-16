import { Injectable, NotFoundException } from "@nestjs/common";
import { AutonomousOperationsService } from "./autonomous-operations.service";
import { DecisionIntelligenceService } from "./decision-intelligence.service";
import { EnterpriseDigitalTwinService } from "./enterprise-digital-twin.service";
import { EnterpriseKnowledgeGraphService } from "./enterprise-knowledge-graph.service";
import type {
  CommandCenterAlertRecord,
  IntelligenceCommandHealth,
  IntelligenceCommandMetrics,
} from "./enterprise-intelligence-command.types";

@Injectable()
export class IntelligenceCommandCenterService {
  private readonly alerts = new Map<string, CommandCenterAlertRecord>();

  constructor(
    private readonly decisions: DecisionIntelligenceService,
    private readonly knowledge: EnterpriseKnowledgeGraphService,
    private readonly twins: EnterpriseDigitalTwinService,
    private readonly operations: AutonomousOperationsService,
  ) {}

  raiseAlert(
    source: string,
    severity: CommandCenterAlertRecord["severity"],
    title: string,
    message: string,
  ): CommandCenterAlertRecord {
    const alert: CommandCenterAlertRecord = {
      id: `command-alert-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      source,
      severity,
      title,
      message,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    this.alerts.set(alert.id, alert);
    return { ...alert };
  }

  acknowledgeAlert(id: string): CommandCenterAlertRecord {
    const alert = this.requireAlert(id);
    alert.status = "ACKNOWLEDGED";
    return { ...alert };
  }

  resolveAlert(id: string): CommandCenterAlertRecord {
    const alert = this.requireAlert(id);
    alert.status = "RESOLVED";
    alert.resolvedAt = new Date().toISOString();
    return { ...alert };
  }

  metrics(): IntelligenceCommandMetrics {
    return {
      decisions: this.decisions.decisionCount(),
      approvedDecisions: this.decisions.approvedCount(),
      scenarios: this.decisions.scenarioCount(),
      recommendations: this.decisions.recommendationCount(),
      knowledgeEntities: this.knowledge.entityCount(),
      knowledgeRelations: this.knowledge.relationCount(),
      digitalTwins: this.twins.twinCount(),
      simulations: this.twins.simulationCount(),
      operations: this.operations.count(),
      runningOperations: this.operations.runningCount(),
      failedOperations: this.operations.failedCount(),
      alerts: this.alerts.size,
      openAlerts: this.alertList().filter((item) => item.status !== "RESOLVED")
        .length,
    };
  }

  health(): IntelligenceCommandHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Intelligence Command Platform",
      version: "1.0.0",
      status:
        metrics.failedOperations > 0 || metrics.openAlerts > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        decisionIntelligence: "READY",
        decisionGraph: "READY",
        scenarioPlanner: "READY",
        recommendationEngine: "READY",
        enterpriseKnowledgeGraph: "READY",
        digitalTwinPlatform: "READY",
        autonomousOperations: "READY",
        intelligenceCommandCenter: "READY",
      },
    };
  }

  dashboard() {
    return {
      success: true,
      health: this.health(),
      decisions: this.decisions.listDecisions(),
      scenarios: this.decisions.listScenarios(),
      recommendations: this.decisions.listRecommendations(),
      knowledgeEntities: this.knowledge.listEntities(),
      knowledgeRelations: this.knowledge.listRelations(),
      digitalTwins: this.twins.listTwins(),
      simulations: this.twins.listSimulations(),
      operations: this.operations.list(),
      alerts: this.alertList(),
    };
  }

  alertList(): CommandCenterAlertRecord[] {
    return Array.from(this.alerts.values())
      .map((item) => ({ ...item }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  private requireAlert(id: string): CommandCenterAlertRecord {
    const alert = this.alerts.get(id);

    if (!alert) {
      throw new NotFoundException(`Command center alert '${id}' was not found.`);
    }

    return alert;
  }
}
