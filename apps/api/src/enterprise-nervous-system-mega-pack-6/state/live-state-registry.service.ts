import { createHash } from "crypto";
import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { LiveStateRecord } from "../enterprise-nervous-system-mega-pack-6.types";
import { StateChangeFeedService } from "../changes/state-change-feed.service";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class LiveStateRegistryService {
  private readonly states = new Map<string, LiveStateRecord>();

  constructor(
    private readonly changes: StateChangeFeedService,
    private readonly audit: LiveCoordinationAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.states.values());
  }

  get(namespace: string, key: string) {
    const state = this.states.get(`${namespace}:${key}`);

    if (!state) {
      throw new NotFoundException(
        `Live state not found: ${namespace}:${key}`
      );
    }

    return state;
  }

  set(input: {
    namespace: string;
    key: string;
    value: unknown;
    expectedVersion?: number;
    sourceNodeId: string;
    ownerIdentityId: string;
    vectorClock?: Record<string, number>;
    metadata?: Record<string, unknown>;
    correlationId: string;
    traceId: string;
  }) {
    const mapKey = `${input.namespace}:${input.key}`;
    const current = this.states.get(mapKey);

    if (
      current &&
      input.expectedVersion !== undefined &&
      current.version !== input.expectedVersion
    ) {
      throw new ConflictException(
        `State version mismatch. Expected ${input.expectedVersion}, actual ${current.version}.`
      );
    }

    const now = new Date().toISOString();
    const nextVersion = (current?.version ?? 0) + 1;
    const vectorClock = {
      ...(current?.vectorClock ?? {}),
      ...(input.vectorClock ?? {}),
      [input.sourceNodeId]:
        Math.max(
          current?.vectorClock[input.sourceNodeId] ?? 0,
          input.vectorClock?.[input.sourceNodeId] ?? 0
        ) + 1
    };

    const checksum = createHash("sha256")
      .update(JSON.stringify({
        namespace: input.namespace,
        key: input.key,
        value: input.value,
        version: nextVersion,
        vectorClock
      }))
      .digest("hex");

    const state: LiveStateRecord = {
      id: current?.id ??
        `live-state:${input.namespace}:${input.key}`,
      namespace: input.namespace,
      key: input.key,
      value: input.value,
      version: nextVersion,
      vectorClock,
      ownerIdentityId: input.ownerIdentityId,
      sourceNodeId: input.sourceNodeId,
      status: "active",
      checksum,
      metadata: {
        ...(current?.metadata ?? {}),
        ...(input.metadata ?? {})
      },
      createdAt: current?.createdAt ?? now,
      updatedAt: now
    };

    this.states.set(mapKey, state);

    this.changes.record({
      stateId: state.id,
      namespace: state.namespace,
      key: state.key,
      type: current ? "updated" : "created",
      fromVersion: current?.version ?? 0,
      toVersion: state.version,
      payload: state.value,
      actorIdentityId: input.ownerIdentityId,
      sourceNodeId: input.sourceNodeId,
      correlationId: input.correlationId,
      traceId: input.traceId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "state",
      action: current
        ? "live-state-updated"
        : "live-state-created",
      subjectId: state.id,
      actorIdentityId: input.ownerIdentityId,
      outcome: "success",
      metadata: {
        namespace: state.namespace,
        key: state.key,
        version: state.version
      }
    });

    return state;
  }

  markConflicted(namespace: string, key: string) {
    const current = this.get(namespace, key);

    const updated: LiveStateRecord = {
      ...current,
      status: "conflicted",
      updatedAt: new Date().toISOString()
    };

    this.states.set(`${namespace}:${key}`, updated);
    return updated;
  }

  restore(input: {
    namespace: string;
    key: string;
    value: unknown;
    sourceNodeId: string;
    ownerIdentityId: string;
    correlationId: string;
    traceId: string;
  }) {
    const current = this.get(input.namespace, input.key);

    const restored = this.set({
      ...input,
      expectedVersion: current.version
    });

    this.changes.record({
      stateId: restored.id,
      namespace: restored.namespace,
      key: restored.key,
      type: "restored",
      fromVersion: current.version,
      toVersion: restored.version,
      payload: restored.value,
      actorIdentityId: input.ownerIdentityId,
      sourceNodeId: input.sourceNodeId,
      correlationId: input.correlationId,
      traceId: input.traceId
    });

    return restored;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.status === "active").length,
      stale: items.filter((x) => x.status === "stale").length,
      conflicted: items.filter((x) => x.status === "conflicted").length,
      offline: items.filter((x) => x.status === "offline").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const seed: LiveStateRecord[] = [
      {
        id: "live-state:platform:health",
        namespace: "platform",
        key: "health",
        value: { status: "healthy" },
        version: 1,
        vectorClock: { "node:primary": 1 },
        ownerIdentityId: "system:avos",
        sourceNodeId: "node:primary",
        status: "active",
        checksum: createHash("sha256")
          .update("platform-health-seed")
          .digest("hex"),
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const item of seed) {
      this.states.set(`${item.namespace}:${item.key}`, item);
    }
  }
}
