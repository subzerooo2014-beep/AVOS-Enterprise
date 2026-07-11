import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { IncidentStatus } from "../enums/incident-status.enum";
import { ErrorClassification } from "../interfaces/error-classification.interface";
import { OperationalIncident } from "../interfaces/operational-incident.interface";

@Injectable()
export class IncidentRegistryService {
  private readonly incidents =
    new Map<string, OperationalIncident>();

  register(input: {
    fingerprint: string;
    title: string;
    message: string;
    classification: ErrorClassification;
    correlationId?: string;
    traceId?: string;
    method?: string;
    path?: string;
    metadata?: Record<string, unknown>;
  }): OperationalIncident {
    const existing = Array.from(
      this.incidents.values(),
    ).find(
      (item) =>
        item.fingerprint === input.fingerprint &&
        item.status !== IncidentStatus.RESOLVED,
    );

    const timestamp = new Date().toISOString();

    if (existing) {
      existing.lastSeenAt = timestamp;
      existing.occurrenceCount += 1;
      existing.message = input.message;
      existing.correlationId = input.correlationId;
      existing.traceId = input.traceId;
      existing.method = input.method;
      existing.path = input.path;
      existing.statusCode =
        input.classification.statusCode;
      existing.metadata = {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {}),
      };

      this.incidents.set(existing.id, existing);

      return { ...existing };
    }

    const incident: OperationalIncident = {
      id: randomUUID(),
      fingerprint: input.fingerprint,
      title: input.title,
      message: input.message,
      category: input.classification.category,
      severity: input.classification.severity,
      status: IncidentStatus.OPEN,
      correlationId: input.correlationId,
      traceId: input.traceId,
      method: input.method,
      path: input.path,
      statusCode: input.classification.statusCode,
      firstSeenAt: timestamp,
      lastSeenAt: timestamp,
      occurrenceCount: 1,
      metadata: input.metadata,
    };

    this.incidents.set(incident.id, incident);

    this.trim();

    return { ...incident };
  }

  findAll(options?: {
    status?: IncidentStatus;
    limit?: number;
  }): OperationalIncident[] {
    const limit = Math.min(
      Math.max(options?.limit ?? 100, 1),
      1000,
    );

    return Array.from(this.incidents.values())
      .filter(
        (item) =>
          !options?.status ||
          item.status === options.status,
      )
      .sort(
        (left, right) =>
          new Date(right.lastSeenAt).getTime() -
          new Date(left.lastSeenAt).getTime(),
      )
      .slice(0, limit)
      .map((item) => ({ ...item }));
  }

  findOne(id: string): OperationalIncident | null {
    const incident = this.incidents.get(id);

    return incident ? { ...incident } : null;
  }

  acknowledge(id: string): OperationalIncident | null {
    const incident = this.incidents.get(id);

    if (!incident) {
      return null;
    }

    incident.status = IncidentStatus.ACKNOWLEDGED;
    incident.acknowledgedAt =
      new Date().toISOString();

    this.incidents.set(id, incident);

    return { ...incident };
  }

  resolve(id: string): OperationalIncident | null {
    const incident = this.incidents.get(id);

    if (!incident) {
      return null;
    }

    incident.status = IncidentStatus.RESOLVED;
    incident.resolvedAt =
      new Date().toISOString();

    this.incidents.set(id, incident);

    return { ...incident };
  }

  getSummary() {
    const incidents = Array.from(
      this.incidents.values(),
    );

    return {
      total: incidents.length,
      open: incidents.filter(
        (item) =>
          item.status === IncidentStatus.OPEN,
      ).length,
      acknowledged: incidents.filter(
        (item) =>
          item.status ===
          IncidentStatus.ACKNOWLEDGED,
      ).length,
      resolved: incidents.filter(
        (item) =>
          item.status === IncidentStatus.RESOLVED,
      ).length,
      critical: incidents.filter(
        (item) => item.severity === "critical",
      ).length,
      error: incidents.filter(
        (item) => item.severity === "error",
      ).length,
      warning: incidents.filter(
        (item) => item.severity === "warning",
      ).length,
    };
  }

  private trim(): void {
    const maximumIncidents = 2000;

    if (this.incidents.size <= maximumIncidents) {
      return;
    }

    const oldest = Array.from(
      this.incidents.values(),
    )
      .sort(
        (left, right) =>
          new Date(left.lastSeenAt).getTime() -
          new Date(right.lastSeenAt).getTime(),
      )
      .slice(
        0,
        this.incidents.size - maximumIncidents,
      );

    for (const incident of oldest) {
      this.incidents.delete(incident.id);
    }
  }
}
