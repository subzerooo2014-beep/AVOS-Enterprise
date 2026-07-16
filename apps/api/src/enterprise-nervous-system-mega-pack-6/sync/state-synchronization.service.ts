import { Injectable } from "@nestjs/common";
import {
  StateSyncRequest
} from "../enterprise-nervous-system-mega-pack-6.types";
import { LiveStateRegistryService } from "../state/live-state-registry.service";
import { StateConflictService } from "../conflicts/state-conflict.service";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class StateSynchronizationService {
  private readonly requests = new Map<string, StateSyncRequest>();

  constructor(
    private readonly states: LiveStateRegistryService,
    private readonly conflicts: StateConflictService,
    private readonly audit: LiveCoordinationAuditService
  ) {}

  synchronize(input: {
    namespace: string;
    key: string;
    sourceNodeId: string;
    targetNodeId: string;
    expectedVersion?: number;
    payload: unknown;
    vectorClock: Record<string, number>;
    ownerIdentityId: string;
    correlationId: string;
    traceId: string;
  }) {
    const now = new Date().toISOString();

    const request: StateSyncRequest = {
      id: `state-sync:${Date.now()}:${this.requests.size + 1}`,
      namespace: input.namespace,
      key: input.key,
      sourceNodeId: input.sourceNodeId,
      targetNodeId: input.targetNodeId,
      expectedVersion: input.expectedVersion,
      payload: input.payload,
      vectorClock: input.vectorClock,
      correlationId: input.correlationId,
      traceId: input.traceId,
      status: "created",
      reasons: [],
      createdAt: now
    };

    this.requests.set(request.id, request);

    try {
      let current;

      try {
        current = this.states.get(input.namespace, input.key);
      }
      catch {
        current = undefined;
      }

      if (
        current &&
        input.expectedVersion !== undefined &&
        current.version !== input.expectedVersion
      ) {
        const conflict = this.conflicts.create({
          namespace: input.namespace,
          key: input.key,
          localStateId: current.id,
          incomingPayload: input.payload,
          localVersion: current.version,
          incomingVersion: input.expectedVersion + 1,
          localVectorClock: current.vectorClock,
          incomingVectorClock: input.vectorClock,
          severity:
            Math.abs(current.version - input.expectedVersion) > 2
              ? "high"
              : "medium",
          correlationId: input.correlationId
        });

        this.states.markConflicted(input.namespace, input.key);

        const conflicted: StateSyncRequest = {
          ...request,
          status: "conflict",
          reasons: [`State conflict created: ${conflict.id}`],
          completedAt: new Date().toISOString()
        };

        this.requests.set(conflicted.id, conflicted);
        return conflicted;
      }

      const state = this.states.set({
        namespace: input.namespace,
        key: input.key,
        value: input.payload,
        expectedVersion: input.expectedVersion,
        sourceNodeId: input.sourceNodeId,
        ownerIdentityId: input.ownerIdentityId,
        vectorClock: input.vectorClock,
        correlationId: input.correlationId,
        traceId: input.traceId
      });

      const applied: StateSyncRequest = {
        ...request,
        status: "applied",
        reasons: [`Applied state version ${state.version}.`],
        completedAt: new Date().toISOString()
      };

      this.requests.set(applied.id, applied);

      this.audit.record({
        correlationId: input.correlationId,
        category: "sync",
        action: "state-synchronization-applied",
        subjectId: applied.id,
        actorIdentityId: input.ownerIdentityId,
        outcome: "success",
        metadata: {
          stateId: state.id,
          version: state.version
        }
      });

      return applied;
    }
    catch (error) {
      const failed: StateSyncRequest = {
        ...request,
        status: "failed",
        reasons: [
          error instanceof Error ? error.message : String(error)
        ],
        completedAt: new Date().toISOString()
      };

      this.requests.set(failed.id, failed);
      return failed;
    }
  }

  list() {
    return Array.from(this.requests.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      applied: items.filter((x) => x.status === "applied").length,
      conflicts: items.filter((x) => x.status === "conflict").length,
      failed: items.filter((x) => x.status === "failed").length,
      rejected: items.filter((x) => x.status === "rejected").length
    };
  }
}
