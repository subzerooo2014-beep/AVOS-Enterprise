import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AuditEventType } from "../enums/audit-event-type.enum";
import { AuditSeverity } from "../enums/audit-severity.enum";
import { AuditEvent } from "../interfaces/audit-event.interface";
import { AuditIntegrityResult } from "../interfaces/audit-integrity-result.interface";
import { AuditHashUtil } from "../utils/audit-hash.util";

@Injectable()
export class AuditLedgerService {
  private readonly events: AuditEvent[] = [];
  private readonly maximumEvents = 10000;

  append(input: {
    type: AuditEventType;
    severity: AuditSeverity;
    action: string;
    message: string;
    actor?: string;
    correlationId?: string;
    traceId?: string;
    method?: string;
    path?: string;
    statusCode?: number;
    metadata?: Record<string, unknown>;
  }): AuditEvent {
    const sequence = this.events.length + 1;

    const previousHash =
      this.events.length > 0
        ? this.events[this.events.length - 1].hash
        : "GENESIS";

    const createdAt = new Date().toISOString();

    const hash = AuditHashUtil.createHash({
      sequence,
      type: input.type,
      severity: input.severity,
      action: input.action,
      message: input.message,
      actor: input.actor,
      correlationId: input.correlationId,
      traceId: input.traceId,
      method: input.method,
      path: input.path,
      statusCode: input.statusCode,
      metadata: input.metadata,
      previousHash,
      createdAt,
    });

    const event: AuditEvent = {
      id: randomUUID(),
      sequence,
      type: input.type,
      severity: input.severity,
      action: input.action,
      message: input.message,
      actor: input.actor,
      correlationId: input.correlationId,
      traceId: input.traceId,
      method: input.method,
      path: input.path,
      statusCode: input.statusCode,
      metadata: input.metadata,
      previousHash,
      hash,
      createdAt,
    };

    this.events.push(event);

    if (this.events.length > this.maximumEvents) {
      this.events.splice(
        0,
        this.events.length - this.maximumEvents,
      );
    }

    return this.clone(event);
  }

  findAll(options?: {
    limit?: number;
    severity?: AuditSeverity;
    type?: AuditEventType;
  }): AuditEvent[] {
    const limit = Math.min(
      Math.max(options?.limit ?? 100, 1),
      1000,
    );

    return this.events
      .filter((event) => {
        if (
          options?.severity &&
          event.severity !== options.severity
        ) {
          return false;
        }

        if (
          options?.type &&
          event.type !== options.type
        ) {
          return false;
        }

        return true;
      })
      .slice(-limit)
      .reverse()
      .map((event) => this.clone(event));
  }

  findOne(id: string): AuditEvent | null {
    const event =
      this.events.find((item) => item.id === id);

    return event ? this.clone(event) : null;
  }

  getSummary() {
    return {
      total: this.events.length,
      info: this.events.filter(
        (item) =>
          item.severity === AuditSeverity.INFO,
      ).length,
      warning: this.events.filter(
        (item) =>
          item.severity === AuditSeverity.WARNING,
      ).length,
      error: this.events.filter(
        (item) =>
          item.severity === AuditSeverity.ERROR,
      ).length,
      critical: this.events.filter(
        (item) =>
          item.severity === AuditSeverity.CRITICAL,
      ).length,
      latestSequence:
        this.events.length > 0 ? this.events[this.events.length - 1].sequence : 0,
      latestHash:
        this.events.length > 0 ? this.events[this.events.length - 1].hash : "GENESIS",
    };
  }

  verifyIntegrity(): AuditIntegrityResult {
    let previousHash = "GENESIS";

    for (
      let index = 0;
      index < this.events.length;
      index += 1
    ) {
      const event = this.events[index];

      const expectedHash =
        AuditHashUtil.createHash({
          sequence: event.sequence,
          type: event.type,
          severity: event.severity,
          action: event.action,
          message: event.message,
          actor: event.actor,
          correlationId: event.correlationId,
          traceId: event.traceId,
          method: event.method,
          path: event.path,
          statusCode: event.statusCode,
          metadata: event.metadata,
          previousHash,
          createdAt: event.createdAt,
        });

      if (
        event.previousHash !== previousHash ||
        event.hash !== expectedHash
      ) {
        return {
          valid: false,
          totalEvents: this.events.length,
          verifiedEvents: index,
          invalidSequence: event.sequence,
          expectedHash,
          actualHash: event.hash,
          checkedAt:
            new Date().toISOString(),
        };
      }

      previousHash = event.hash;
    }

    return {
      valid: true,
      totalEvents: this.events.length,
      verifiedEvents: this.events.length,
      checkedAt:
        new Date().toISOString(),
    };
  }

  private clone(event: AuditEvent): AuditEvent {
    return {
      ...event,
      metadata: event.metadata
        ? { ...event.metadata }
        : undefined,
    };
  }
}

