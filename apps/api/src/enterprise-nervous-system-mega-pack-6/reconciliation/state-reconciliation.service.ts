import { ConflictException, Injectable } from "@nestjs/common";
import { ReconciliationResult } from "../enterprise-nervous-system-mega-pack-6.types";
import { LiveStateRegistryService } from "../state/live-state-registry.service";
import { StateConflictService } from "../conflicts/state-conflict.service";
import { StateChangeFeedService } from "../changes/state-change-feed.service";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class StateReconciliationService {
  private readonly results =
    new Map<string, ReconciliationResult>();

  constructor(
    private readonly states: LiveStateRegistryService,
    private readonly conflicts: StateConflictService,
    private readonly changes: StateChangeFeedService,
    private readonly audit: LiveCoordinationAuditService
  ) {}

  reconcile(input: {
    conflictId: string;
    strategy: ReconciliationResult["strategy"];
    sourcePriority?: "local" | "incoming";
    humanApproved: boolean;
    resolvedByIdentityId: string;
    correlationId: string;
    traceId: string;
  }) {
    const conflict = this.conflicts.get(input.conflictId);

    if (
      (
        conflict.severity === "critical" ||
        input.strategy === "human-decision"
      ) &&
      !input.humanApproved
    ) {
      throw new ConflictException(
        "Critical or human-decision reconciliation requires human approval."
      );
    }

    const local = this.states.get(
      conflict.namespace,
      conflict.key
    );

    let selectedVersion = local.version;
    let mergedValue = local.value;

    switch (input.strategy) {
      case "latest-version":
        if (conflict.incomingVersion > local.version) {
          selectedVersion = conflict.incomingVersion;
          mergedValue = conflict.incomingPayload;
        }
        break;
      case "source-priority":
        if (input.sourcePriority === "incoming") {
          selectedVersion = conflict.incomingVersion;
          mergedValue = conflict.incomingPayload;
        }
        break;
      case "merge":
        if (
          typeof local.value === "object" &&
          local.value !== null &&
          typeof conflict.incomingPayload === "object" &&
          conflict.incomingPayload !== null
        ) {
          mergedValue = {
            ...(local.value as Record<string, unknown>),
            ...(conflict.incomingPayload as Record<string, unknown>)
          };
          selectedVersion = Math.max(
            local.version,
            conflict.incomingVersion
          ) + 1;
        }
        break;
      case "human-decision":
        mergedValue =
          input.sourcePriority === "incoming"
            ? conflict.incomingPayload
            : local.value;
        selectedVersion =
          input.sourcePriority === "incoming"
            ? conflict.incomingVersion
            : local.version;
        break;
    }

    const updated = this.states.set({
      namespace: conflict.namespace,
      key: conflict.key,
      value: mergedValue,
      sourceNodeId: local.sourceNodeId,
      ownerIdentityId: input.resolvedByIdentityId,
      vectorClock: {
        ...local.vectorClock
      },
      correlationId: input.correlationId,
      traceId: input.traceId
    });

    const result: ReconciliationResult = {
      id: `reconciliation:${Date.now()}:${this.results.size + 1}`,
      conflictId: conflict.id,
      strategy: input.strategy,
      selectedVersion: Math.max(selectedVersion, updated.version),
      mergedValue,
      humanApproved: input.humanApproved,
      resolvedByIdentityId: input.resolvedByIdentityId,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.results.set(result.id, result);
    this.conflicts.resolve(
      conflict.id,
      `Resolved using ${input.strategy}.`,
      input.resolvedByIdentityId
    );

    this.changes.record({
      stateId: updated.id,
      namespace: updated.namespace,
      key: updated.key,
      type: "reconciled",
      fromVersion: local.version,
      toVersion: updated.version,
      payload: updated.value,
      actorIdentityId: input.resolvedByIdentityId,
      sourceNodeId: updated.sourceNodeId,
      correlationId: input.correlationId,
      traceId: input.traceId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "reconciliation",
      action: "state-conflict-reconciled",
      subjectId: result.id,
      actorIdentityId: input.resolvedByIdentityId,
      outcome: "success",
      metadata: {
        conflictId: conflict.id,
        strategy: input.strategy
      }
    });

    return result;
  }

  list() {
    return Array.from(this.results.values());
  }

  summary() {
    return {
      total: this.results.size,
      humanApproved:
        this.list().filter((x) => x.humanApproved).length
    };
  }
}
