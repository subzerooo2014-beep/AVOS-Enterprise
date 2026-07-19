import { Injectable } from "@nestjs/common";
import { EventMeshHealth } from "./platform-production-mega-pack-4.types";
import { EventRegistryService } from "./event-registry.service";
import { EventRoutingService } from "./event-routing.service";
import { EventStreamsService } from "./event-streams.service";
import { WorkflowIntegrationService } from "./workflow-integration.service";
import { DistributedCoordinationService } from "./distributed-coordination.service";
import { PlatformAutomationService } from "./platform-automation.service";
import { DeadLetterManagementService } from "./dead-letter-management.service";
import { EventObservabilityService } from "./event-observability.service";

@Injectable()
export class PlatformProductionMegaPack4StatusService {
  constructor(
    private readonly registry: EventRegistryService,
    private readonly routing: EventRoutingService,
    private readonly streams: EventStreamsService,
    private readonly workflows: WorkflowIntegrationService,
    private readonly coordination: DistributedCoordinationService,
    private readonly automation: PlatformAutomationService,
    private readonly deadLetters: DeadLetterManagementService,
    private readonly observability: EventObservabilityService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  health(): EventMeshHealth {
    const contracts = this.registry.listContracts().length;
    const routes = this.routing.listRoutes().length;
    const workflowBindings = this.workflows.listBindings().length;
    const automationRules = this.automation.listRules().length;
    const activeLeases = this.coordination
      .list()
      .filter((lease) => lease.status === "active").length;
    const deadLettersPending = this.deadLetters
      .list()
      .filter((item) => item.status === "pending").length;
    const observations = this.observability.list().length;

    const blockingIssues: string[] = [];

    if (contracts < 3) {
      blockingIssues.push("Required event contracts are missing.");
    }

    if (routes < 3) {
      blockingIssues.push("Required event routes are missing.");
    }

    if (workflowBindings < 2) {
      blockingIssues.push("Workflow bindings are incomplete.");
    }

    if (automationRules < 2) {
      blockingIssues.push("Automation rules are incomplete.");
    }

    const score = Math.max(
      0,
      100 -
        blockingIssues.length * 20 -
        deadLettersPending * 5,
    );

    return {
      id: this.id("event-mesh-health"),
      score,
      state:
        score >= 90 && blockingIssues.length === 0
          ? "healthy"
          : score >= 60
            ? "degraded"
            : "critical",
      contracts,
      routes,
      streams: 0,
      workflowBindings,
      automationRules,
      activeLeases,
      deadLettersPending,
      observations,
      blockingIssues,
      createdAt: this.now(),
    };
  }

  status(): Record<string, unknown> {
    return {
      name: "AVOS Platform Production Integration — Mega Pack 4",
      version: "PPI-MP4-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      components: {
        platformEventMesh: true,
        unifiedMessaging: true,
        eventRouting: true,
        eventContracts: true,
        eventStreams: true,
        workflowIntegration: true,
        distributedCoordination: true,
        platformAutomation: true,
        deadLetterManagement: true,
        eventObservability: true,
      },
      health: this.health(),
    };
  }
}