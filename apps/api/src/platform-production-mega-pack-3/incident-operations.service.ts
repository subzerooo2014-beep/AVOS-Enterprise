import { Injectable } from "@nestjs/common";
import { IncidentRecord } from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";

@Injectable()
export class IncidentOperationsService {
  constructor(
    private readonly store: OperationsFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  open(input: {
    title: string;
    severity: IncidentRecord["severity"];
    environment: IncidentRecord["environment"];
    commander: string;
    affectedServices: string[];
    summary: string;
  }): IncidentRecord {
    const incident: IncidentRecord = {
      ...input,
      id: this.id("incident"),
      status: "open",
      timeline: [
        {
          at: this.now(),
          actor: input.commander,
          action: "Incident opened.",
        },
      ],
      createdAt: this.now(),
    };

    this.store.writeJson(`incidents/${incident.id}.json`, incident);
    return incident;
  }

  update(
    id: string,
    status: IncidentRecord["status"],
    actor: string,
    action: string,
  ): IncidentRecord {
    const incident = this.get(id);

    const updated: IncidentRecord = {
      ...incident,
      status,
      timeline: [
        ...incident.timeline,
        {
          at: this.now(),
          actor,
          action,
        },
      ],
      resolvedAt:
        ["resolved", "closed"].includes(status)
          ? this.now()
          : incident.resolvedAt,
    };

    this.store.writeJson(`incidents/${updated.id}.json`, updated);
    return updated;
  }

  resolve(id: string, actor: string): IncidentRecord {
    return this.update(
      id,
      "resolved",
      actor,
      "Incident resolved and service restored.",
    );
  }

  list(): IncidentRecord[] {
    return this.store.listJson<IncidentRecord>("incidents");
  }

  get(id: string): IncidentRecord {
    const incident = this.list().find((item) => item.id === id);

    if (!incident) {
      throw new Error(`Incident not found: ${id}`);
    }

    return incident;
  }
}