import { Injectable } from "@nestjs/common";
import { ThreatSignal, ThreatSeverity } from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class ThreatDetectionService {
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

  detect(input: {
    source: string;
    type: string;
    severity: ThreatSeverity;
    confidence: number;
    subject: string;
    indicators: Record<string, unknown>;
  }): ThreatSignal {
    const timestamp = this.now();
    const signal: ThreatSignal = {
      ...input,
      id: this.id("threat"),
      status: "open",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`threats/${signal.id}.json`, signal);
    this.audit.record({
      category: "threat-detection",
      action: "detect",
      actor: input.source,
      subject: input.subject,
      outcome: signal.severity,
      metadata: { confidence: signal.confidence, type: signal.type },
    });

    return signal;
  }

  contain(id: string, actor: string): ThreatSignal {
    const threat = this.get(id);
    const contained: ThreatSignal = {
      ...threat,
      status: "contained",
      updatedAt: this.now(),
    };

    this.store.writeJson(`threats/${contained.id}.json`, contained);
    this.audit.record({
      category: "threat-detection",
      action: "contain",
      actor,
      subject: contained.id,
      outcome: "success",
      metadata: {},
    });

    return contained;
  }

  list(): ThreatSignal[] {
    return this.store.listJson<ThreatSignal>("threats");
  }

  get(id: string): ThreatSignal {
    const threat = this.list().find((item) => item.id === id);

    if (!threat) {
      throw new Error(`Threat not found: ${id}`);
    }

    return threat;
  }
}