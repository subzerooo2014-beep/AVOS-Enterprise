import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterpriseIncident,
  EnterpriseIncidentSeverity,
} from "./enterprise-e4.types";

@Injectable()
export class EnterpriseIncidentCommandService {
  private readonly incidents = new Map<string, EnterpriseIncident>();

  create(input: {
    title?: string;
    source?: string;
    severity?: EnterpriseIncidentSeverity;
    metadata?: Record<string, unknown>;
  }): EnterpriseIncident {
    const incident: EnterpriseIncident = {
      id: randomUUID(),
      title: input.title?.trim() || "Enterprise runtime incident",
      source: input.source?.trim() || "enterprise-e4",
      severity: input.severity || "MEDIUM",
      status: "OPEN",
      detectedAt: new Date().toISOString(),
      metadata: input.metadata || {},
    };

    this.incidents.set(incident.id, incident);
    return incident;
  }

  acknowledge(id: string): EnterpriseIncident {
    const incident = this.requireIncident(id);
    incident.status = "ACKNOWLEDGED";
    incident.acknowledgedAt = new Date().toISOString();
    return incident;
  }

  resolve(id: string): EnterpriseIncident {
    const incident = this.requireIncident(id);
    incident.status = "RESOLVED";
    incident.resolvedAt = new Date().toISOString();
    return incident;
  }

  list(): EnterpriseIncident[] {
    return [...this.incidents.values()];
  }

  active(): EnterpriseIncident[] {
    return this.list().filter((incident) => incident.status !== "RESOLVED");
  }

  private requireIncident(id: string): EnterpriseIncident {
    const incident = this.incidents.get(id);
    if (!incident) {
      throw new NotFoundException(`Enterprise incident not found: ${id}`);
    }
    return incident;
  }
}