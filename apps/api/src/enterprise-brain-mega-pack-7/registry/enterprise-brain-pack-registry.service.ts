import { Injectable } from "@nestjs/common";
import { EnterpriseBrainPackRecord } from "../enterprise-brain-mega-pack-7.types";

@Injectable()
export class EnterpriseBrainPackRegistryService {
  private readonly packs = new Map<string, EnterpriseBrainPackRecord>();

  constructor() {
    this.seed();
  }

  list() {
    return Array.from(this.packs.values())
      .sort((left, right) => left.packNumber - right.packNumber);
  }

  get(packNumber: number) {
    const pack = this.packs.get(`enterprise-brain-pack:${packNumber}`);

    if (!pack) {
      throw new Error(`Enterprise Brain Mega Pack not found: ${packNumber}`);
    }

    return pack;
  }

  update(
    packNumber: number,
    patch: Partial<EnterpriseBrainPackRecord>
  ) {
    const current = this.get(packNumber);

    const updated: EnterpriseBrainPackRecord = {
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
      "Brain Foundation & Context Core",
      "Knowledge Graph, Semantic Core & Enterprise Memory Foundation",
      "Reasoning, Decision Graph & Planning Core",
      "Learning, Feedback & Predictive Intelligence Core",
      "Multi-Agent Coordination, Consensus & Supervisor Brain Core",
      "Explainability, Trust, Decision Traceability & Brain Diagnostics Core",
      "Cross-Brain Validation, Final Certification, Smoke Test, Release Decision & Final Health"
    ];

    for (let number = 1; number <= 7; number += 1) {
      const pack: EnterpriseBrainPackRecord = {
        id: `enterprise-brain-pack:${number}`,
        packNumber: number,
        name: names[number - 1] ?? `Mega Pack ${number}`,
        route: `enterprise-brain-v${number}`,
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
