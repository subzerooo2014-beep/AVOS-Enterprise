import { Injectable } from "@nestjs/common";
import { PresenceRecord, PresenceStatus } from "../enterprise-nervous-system-mega-pack-6.types";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class PresenceService {
  private readonly records = new Map<string, PresenceRecord>();

  constructor(
    private readonly audit: LiveCoordinationAuditService
  ) {
    this.seed();
  }

  heartbeat(input: {
    identityId: string;
    nodeId: string;
    status: PresenceStatus;
    capabilities: string[];
    ttlSeconds?: number;
    metadata?: Record<string, unknown>;
    correlationId: string;
  }) {
    const key = `${input.identityId}:${input.nodeId}`;
    const now = new Date();
    const record: PresenceRecord = {
      id: `presence:${key}`,
      identityId: input.identityId,
      nodeId: input.nodeId,
      status: input.status,
      capabilities: Array.from(new Set(input.capabilities)),
      lastSeenAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() + (input.ttlSeconds ?? 60) * 1000
      ).toISOString(),
      metadata: input.metadata ?? {}
    };

    this.records.set(key, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "presence",
      action: "presence-heartbeat-received",
      subjectId: record.id,
      actorIdentityId: input.identityId,
      outcome: "success",
      metadata: {
        nodeId: record.nodeId,
        status: record.status
      }
    });

    return record;
  }

  list() {
    const now = Date.now();

    return Array.from(this.records.values()).map((record) => {
      if (
        record.status !== "offline" &&
        new Date(record.expiresAt).getTime() <= now
      ) {
        const offline: PresenceRecord = {
          ...record,
          status: "offline"
        };

        this.records.set(
          `${record.identityId}:${record.nodeId}`,
          offline
        );

        return offline;
      }

      return record;
    });
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      online: items.filter((x) => x.status === "online").length,
      away: items.filter((x) => x.status === "away").length,
      busy: items.filter((x) => x.status === "busy").length,
      offline: items.filter((x) => x.status === "offline").length
    };
  }

  private seed() {
    const now = new Date();
    const record: PresenceRecord = {
      id: "presence:system-avOS:node-primary",
      identityId: "system:avos",
      nodeId: "node:primary",
      status: "online",
      capabilities: [
        "state.sync",
        "telemetry.publish"
      ],
      lastSeenAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
      metadata: { seeded: true }
    };

    this.records.set(
      `${record.identityId}:${record.nodeId}`,
      record
    );
  }
}
