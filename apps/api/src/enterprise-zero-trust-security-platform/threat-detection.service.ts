import { Injectable, NotFoundException } from "@nestjs/common";
import type { ThreatRecord } from "./zero-trust-security.types";

@Injectable()
export class ThreatDetectionService {
  private readonly threats = new Map<string, ThreatRecord>();

  detect(
    input: Omit<ThreatRecord, "id" | "status" | "createdAt">,
  ): ThreatRecord {
    const threat: ThreatRecord = {
      ...input,
      id: `threat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    this.threats.set(threat.id, threat);
    return { ...threat };
  }

  investigate(id: string): ThreatRecord {
    const threat = this.requireThreat(id);
    threat.status = "INVESTIGATING";
    return { ...threat };
  }

  resolve(id: string): ThreatRecord {
    const threat = this.requireThreat(id);
    threat.status = "RESOLVED";
    threat.resolvedAt = new Date().toISOString();
    return { ...threat };
  }

  list(): ThreatRecord[] {
    return Array.from(this.threats.values())
      .map((item) => ({ ...item }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  count(): number {
    return this.threats.size;
  }

  openCount(): number {
    return this.list().filter((item) => item.status !== "RESOLVED").length;
  }

  private requireThreat(id: string): ThreatRecord {
    const threat = this.threats.get(id);
    if (!threat) throw new NotFoundException(`Threat '${id}' was not found.`);
    return threat;
  }
}
