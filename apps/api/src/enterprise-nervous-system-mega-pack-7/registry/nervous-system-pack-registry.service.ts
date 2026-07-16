import { Injectable } from "@nestjs/common";
import { NervousSystemPackRecord } from "../enterprise-nervous-system-mega-pack-7.types";

@Injectable()
export class NervousSystemPackRegistryService {
  private readonly packs = new Map<string, NervousSystemPackRecord>();

  constructor() {
    this.seed();
  }

  list() {
    return Array.from(this.packs.values())
      .sort((left, right) => left.packNumber - right.packNumber);
  }

  get(packNumber: number) {
    const pack = this.packs.get(`enterprise-nervous-system-pack:${packNumber}`);

    if (!pack) {
      throw new Error(
        `Enterprise Nervous System Mega Pack not found: ${packNumber}`
      );
    }

    return pack;
  }

  update(
    packNumber: number,
    patch: Partial<NervousSystemPackRecord>
  ) {
    const current = this.get(packNumber);

    const updated: NervousSystemPackRecord = {
      ...current,
      ...patch,
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      }
    };

    this.packs.set(updated.id, updated);
    return updated;
  }

  summary() {
    const packs = this.list();

    return {
      total: packs.length,
      required: packs.filter((x) => x.required).length,
      registered: packs.filter((x) => x.registered).length,
      verified: packs.filter((x) => x.verified).length,
      buildPassed: packs.filter((x) => x.buildPassed).length,
      healthy: packs.filter((x) => x.healthy).length,
      failed: packs.filter(
        (x) =>
          !x.registered ||
          !x.verified ||
          !x.buildPassed ||
          !x.healthy
      ).length
    };
  }

  private seed() {
    const names = [
      "Enterprise Event Bus & Messaging Core",
      "Enterprise Signals, Topics, Routing & Subscription Intelligence Core",
      "Workflow & Event Orchestration Core",
      "Distributed Event Streaming, Replay & Durable Log Core",
      "Service Mesh, Capability Communication & Resilient Connectivity Core",
      "Real-Time State Synchronization, Telemetry & Live Coordination Core",
      "Cross-System Validation, Final Certification, Smoke Test, Release Decision & Final Health"
    ];

    for (let number = 1; number <= 7; number += 1) {
      const pack: NervousSystemPackRecord = {
        id: `enterprise-nervous-system-pack:${number}`,
        packNumber: number,
        name: names[number - 1] ?? `Mega Pack ${number}`,
        route: `enterprise-nervous-system-v${number}`,
        version: `${number}.0.0`,
        registered: true,
        verified: true,
        buildPassed: true,
        healthy: true,
        required: true,
        metadata: {
          seeded: true
        }
      };

      this.packs.set(pack.id, pack);
    }
  }
}
