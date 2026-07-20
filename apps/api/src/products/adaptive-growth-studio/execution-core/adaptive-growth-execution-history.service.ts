import { Injectable } from "@nestjs/common";
import {
  AgsExecutionEventType,
  AgsExecutionHistoryEntry,
  AgsExecutionState,
} from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthExecutionIdService } from "./adaptive-growth-execution-id.service";

@Injectable()
export class AdaptiveGrowthExecutionHistoryService {
  private readonly entries:
    AgsExecutionHistoryEntry[] = [];

  constructor(
    private readonly ids:
      AdaptiveGrowthExecutionIdService,
  ) {}

  record(input: {
    actionId: string;
    executionId?: string;
    eventType: AgsExecutionEventType;
    fromState?: AgsExecutionState;
    toState: AgsExecutionState;
    actor?: string;
    reason?: string;
    evidence?: Record<string, unknown>;
  }): AgsExecutionHistoryEntry {
    const entry: AgsExecutionHistoryEntry = {
      id: this.ids.create("ags-history"),
      actionId: input.actionId,
      executionId: input.executionId,
      eventType: input.eventType,
      fromState: input.fromState,
      toState: input.toState,
      actor: input.actor ?? "system:ags",
      reason: input.reason,
      evidence: input.evidence ?? {},
      createdAt: new Date().toISOString(),
    };

    this.entries.unshift(entry);

    return entry;
  }

  list(actionId?: string):
    AgsExecutionHistoryEntry[] {
    if (!actionId) {
      return [...this.entries];
    }

    return this.entries.filter(
      (item) => item.actionId === actionId,
    );
  }

  status() {
    return {
      name: "AGS Execution History",
      status: "operational",
      entries: this.entries.length,
      auditReady: true,
      persistenceMode: "in-memory",
    };
  }
}