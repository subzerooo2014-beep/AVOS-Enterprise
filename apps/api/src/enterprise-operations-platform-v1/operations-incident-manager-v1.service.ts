import { Injectable, NotFoundException } from "@nestjs/common";
import type { OperationsIncidentV1 } from "./enterprise-operations-platform-v1.types";

@Injectable()
export class OperationsIncidentManagerV1Service {
  private readonly incidents = new Map<string, OperationsIncidentV1>();

  create(
    title: string,
    severity: OperationsIncidentV1["severity"],
    affectedServices: string[],
    description: string,
    owner?: string,
  ): OperationsIncidentV1 {
    const now = new Date().toISOString();

    const incident: OperationsIncidentV1 = {
      id: `operations-incident-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title,
      severity,
      status: "OPEN",
      affectedServices: [...affectedServices],
      owner,
      description,
      createdAt: now,
      updatedAt: now,
    };

    this.incidents.set(incident.id, incident);
    return this.clone(incident);
  }

  transition(
    id: string,
    status: OperationsIncidentV1["status"],
  ): OperationsIncidentV1 {
    const incident = this.requireIncident(id);
    incident.status = status;
    incident.updatedAt = new Date().toISOString();
    return this.clone(incident);
  }

  get(id: string): OperationsIncidentV1 {
    return this.clone(this.requireIncident(id));
  }

  list(): OperationsIncidentV1[] {
    return Array.from(this.incidents.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.incidents.size;
  }

  openCount(): number {
    return this.list().filter(
      (item) => item.status === "OPEN" || item.status === "INVESTIGATING",
    ).length;
  }

  criticalCount(): number {
    return this.list().filter(
      (item) =>
        item.severity === "CRITICAL" &&
        item.status !== "RESOLVED",
    ).length;
  }

  private requireIncident(id: string): OperationsIncidentV1 {
    const incident = this.incidents.get(id);

    if (!incident) {
      throw new NotFoundException(`Operations incident '${id}' was not found.`);
    }

    return incident;
  }

  private clone(item: OperationsIncidentV1): OperationsIncidentV1 {
    return { ...item, affectedServices: [...item.affectedServices] };
  }
}
