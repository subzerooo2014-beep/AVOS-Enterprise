import { Injectable } from "@nestjs/common";
import { KernelPackRecord } from "../enterprise-kernel-mega-pack-7.types";

@Injectable()
export class EnterpriseKernelPackRegistryService {
  private readonly packs = new Map<string, KernelPackRecord>();

  constructor() {
    this.seed();
  }

  list() {
    return Array.from(this.packs.values())
      .sort((left, right) => left.packNumber - right.packNumber);
  }

  get(packNumber: number) {
    const pack = this.packs.get(`enterprise-kernel-pack:${packNumber}`);

    if (!pack) {
      throw new Error(
        `Enterprise Kernel Mega Pack not found: ${packNumber}`
      );
    }

    return pack;
  }

  update(
    packNumber: number,
    patch: Partial<KernelPackRecord>
  ) {
    const current = this.get(packNumber);

    const updated: KernelPackRecord = {
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
      "Runtime & Lifecycle Core",
      "Dependency, Configuration & Compatibility Core",
      "Security, Policy & Execution Control Core",
      "Health, Diagnostics, Recovery & Safe Mode Core",
      "Event, Command & Orchestration Core",
      "Plugin, Extension & Kernel Public Services Core",
      "Observability, Living Kernel, Meta Kernel & Final Certification"
    ];

    for (let number = 1; number <= 7; number += 1) {
      const pack: KernelPackRecord = {
        id: `enterprise-kernel-pack:${number}`,
        packNumber: number,
        name: names[number - 1] ?? `Mega Pack ${number}`,
        route: `enterprise-kernel-v${number}`,
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
