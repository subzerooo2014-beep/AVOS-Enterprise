import { Injectable, NotFoundException } from "@nestjs/common";
import type { SecurityIncidentRecord } from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class SecurityIncidentService {
  private readonly incidents = new Map<string, SecurityIncidentRecord>();

  report(
    input: Omit<SecurityIncidentRecord, "id" | "status" | "createdAt">,
  ): SecurityIncidentRecord {
    const incident: SecurityIncidentRecord = {
      ...input,
      metadata: input.metadata ? { ...input.metadata } : undefined,
      id: `security-incident-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    this.incidents.set(incident.id, incident);
    return this.clone(incident);
  }

  resolve(id: string): SecurityIncidentRecord {
    const incident = this.incidents.get(id);
    if (!incident) {
      throw new NotFoundException(`Security incident '${id}' was not found.`);
    }

    incident.status = "RESOLVED";
    incident.resolvedAt = new Date().toISOString();
    return this.clone(incident);
  }

  list(): SecurityIncidentRecord[] {
    return Array.from(this.incidents.values())
      .map((incident) => this.clone(incident))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  openCount(): number {
    return this.list().filter((incident) => incident.status !== "RESOLVED").length;
  }

  count(): number {
    return this.incidents.size;
  }

  private clone(incident: SecurityIncidentRecord): SecurityIncidentRecord {
    return {
      ...incident,
      metadata: incident.metadata ? { ...incident.metadata } : undefined,
    };
  }
}
