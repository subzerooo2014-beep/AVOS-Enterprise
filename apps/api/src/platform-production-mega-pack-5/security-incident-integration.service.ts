import { Injectable } from "@nestjs/common";
import { SecurityIncident, ThreatSignal } from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class SecurityIncidentIntegrationService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
    private readonly audit: SecurityAuditService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  openFromThreat(
    threat: ThreatSignal,
    owner = "platform-security-operations",
  ): SecurityIncident {
    const existing = this.list().find(
      (incident) => incident.sourceThreatId === threat.id,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const incident: SecurityIncident = {
      id: this.id("security-incident"),
      title: `${threat.type} detected for ${threat.subject}`,
      severity: threat.severity,
      sourceThreatId: threat.id,
      status: "open",
      owner,
      timeline: [
        {
          at: timestamp,
          action: "incident-opened",
          actor: "platform-security-control",
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`incidents/${incident.id}.json`, incident);
    this.audit.record({
      category: "security-incident",
      action: "open",
      actor: "platform-security-control",
      subject: incident.id,
      outcome: "success",
      metadata: { sourceThreatId: threat.id },
    });

    return incident;
  }

  resolve(id: string, approvedBy: string): SecurityIncident {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Security incident resolution requires Human Final Authority.");
    }

    const incident = this.get(id);
    const timestamp = this.now();
    const resolved: SecurityIncident = {
      ...incident,
      status: "resolved",
      updatedAt: timestamp,
      timeline: [
        ...incident.timeline,
        {
          at: timestamp,
          action: "incident-resolved",
          actor: approvedBy,
        },
      ],
    };

    this.store.writeJson(`incidents/${resolved.id}.json`, resolved);
    return resolved;
  }

  list(): SecurityIncident[] {
    return this.store.listJson<SecurityIncident>("incidents");
  }

  get(id: string): SecurityIncident {
    const incident = this.list().find((item) => item.id === id);

    if (!incident) {
      throw new Error(`Security incident not found: ${id}`);
    }

    return incident;
  }
}