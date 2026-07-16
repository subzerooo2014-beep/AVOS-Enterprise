import { Injectable, NotFoundException } from "@nestjs/common";
import type { OperationsIncidentRecord } from "./enterprise-autonomous-operations.types";

@Injectable()
export class AutonomousIncidentManagerService {
  private readonly incidents = new Map<string, OperationsIncidentRecord>();

  create(
    title: string,
    severity: OperationsIncidentRecord["severity"],
    source: string,
  ): OperationsIncidentRecord {
    const incident: OperationsIncidentRecord = {
      id: `ops-incident-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title,
      severity,
      status: "OPEN",
      source,
      createdAt: new Date().toISOString(),
    };

    this.incidents.set(incident.id, incident);
    return { ...incident };
  }

  resolve(id: string): OperationsIncidentRecord {
    const incident = this.incidents.get(id);
    if (!incident) throw new NotFoundException(`Operations incident '${id}' was not found.`);
    incident.status = "RESOLVED";
    incident.resolvedAt = new Date().toISOString();
    return { ...incident };
  }

  list(): OperationsIncidentRecord[] {
    return Array.from(this.incidents.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.incidents.size;
  }

  openCount(): number {
    return this.list().filter((item) => item.status !== "RESOLVED").length;
  }
}
