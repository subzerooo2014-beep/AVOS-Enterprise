import { Injectable } from "@nestjs/common";
import {
  AgsAgent,
  AgsAgentTask,
  AgsCapabilityInvocation,
  AgsLearningOutcome,
  AgsPlatformAlert,
  AgsStrategyProfile,
  AgsTelemetryEvent,
  AgsWorkflow,
} from "./adaptive-growth-ultimate.contracts";

@Injectable()
export class AdaptiveGrowthUltimateStoreService {
  readonly invocations = new Map<string, AgsCapabilityInvocation>();
  readonly workflows = new Map<string, AgsWorkflow>();
  readonly telemetry: AgsTelemetryEvent[] = [];
  readonly outcomes = new Map<string, AgsLearningOutcome>();
  readonly strategies = new Map<string, AgsStrategyProfile>();
  readonly agents = new Map<string, AgsAgent>();
  readonly tasks = new Map<string, AgsAgentTask>();
  readonly alerts = new Map<string, AgsPlatformAlert>();

  snapshot() {
    return {
      invocations: this.invocations.size,
      workflows: this.workflows.size,
      telemetryEvents: this.telemetry.length,
      outcomes: this.outcomes.size,
      strategies: this.strategies.size,
      agents: this.agents.size,
      tasks: this.tasks.size,
      alerts: this.alerts.size,
      persistenceMode: "in-memory-foundation",
      durablePersistencePlanned: true,
    };
  }
}