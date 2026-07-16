import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  IncidentRecord,
  IncidentTimelineEntry,
} from "./reliability-observability.types";

@Injectable()
export class IncidentManagerService {
  private readonly incidents = new Map<string, IncidentRecord>();

  create(
    input: Omit<IncidentRecord, "id" | "status" | "timeline" | "createdAt">,
  ): IncidentRecord {
    const incident: IncidentRecord = {
      ...input,
      id: `incident-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      status: "OPEN",
      timeline: [],
      createdAt: new Date().toISOString(),
    };

    this.incidents.set(incident.id, incident);
    return this.clone(incident);
  }

  addTimeline(id: string, message: string): IncidentRecord {
    const incident = this.requireIncident(id);
    const entry: IncidentTimelineEntry = {
      id: `timeline-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      message,
      createdAt: new Date().toISOString(),
    };

    incident.timeline.push(entry);
    return this.clone(incident);
  }

  investigate(id: string): IncidentRecord {
    const incident = this.requireIncident(id);
    incident.status = "INVESTIGATING";
    return this.clone(incident);
  }

  resolve(id: string): IncidentRecord {
    const incident = this.requireIncident(id);
    incident.status = "RESOLVED";
    incident.resolvedAt = new Date().toISOString();
    return this.clone(incident);
  }

  list(): IncidentRecord[] {
    return Array.from(this.incidents.values())
      .map((incident) => this.clone(incident))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  count(): number {
    return this.incidents.size;
  }

  openCount(): number {
    return this.list().filter((incident) => incident.status !== "RESOLVED")
      .length;
  }

  private requireIncident(id: string): IncidentRecord {
    const incident = this.incidents.get(id);

    if (!incident) {
      throw new NotFoundException(`Incident '${id}' was not found.`);
    }

    return incident;
  }

  private clone(incident: IncidentRecord): IncidentRecord {
    return {
      ...incident,
      timeline: incident.timeline.map((entry) => ({ ...entry })),
    };
  }
}
