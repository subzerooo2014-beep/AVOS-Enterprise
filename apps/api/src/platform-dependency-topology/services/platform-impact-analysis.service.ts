import { Injectable } from "@nestjs/common";
import { PlatformRegistryService } from "../../platform-control-plane/services/platform-registry.service";
import { PlatformImpactReport } from "../contracts/platform-dependency.contracts";
import { PlatformDependencyRegistryService } from "./platform-dependency-registry.service";

@Injectable()
export class PlatformImpactAnalysisService {
  constructor(
    private readonly platformRegistry: PlatformRegistryService,
    private readonly dependencies: PlatformDependencyRegistryService
  ) {}

  analyze(serviceId: string): PlatformImpactReport {
    this.platformRegistry.get(serviceId);

    const direct = this.dependencies
      .dependentsOf(serviceId)
      .map((item) => item.sourceServiceId);

    const visited = new Set<string>(direct);
    const queue = [...direct];

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const record of this.dependencies.dependentsOf(current)) {
        if (!visited.has(record.sourceServiceId)) {
          visited.add(record.sourceServiceId);
          queue.push(record.sourceServiceId);
        }
      }
    }

    const indirect = [...visited].filter((item) => !direct.includes(item));
    const serviceCount = Math.max(1, this.platformRegistry.list().length);
    const totalAffected = visited.size;

    return {
      serviceId,
      directlyAffected: direct.sort(),
      indirectlyAffected: indirect.sort(),
      totalAffected,
      impactPercentage: Number(((totalAffected / serviceCount) * 100).toFixed(2)),
      critical: totalAffected >= Math.max(2, Math.ceil(serviceCount * 0.25)),
      generatedAt: new Date().toISOString()
    };
  }
}