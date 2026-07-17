import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilityGeneratedArtifact,
  CapabilityProductionCertificate,
  CapabilityReleasePackage
} from "./capability-production.contracts";

@Injectable()
export class CapabilityReleasePackagerService {
  private readonly items = new Map<string, CapabilityReleasePackage>();

  package(
    blueprint: CapabilityBlueprint,
    certificate: CapabilityProductionCertificate,
    artifacts: CapabilityGeneratedArtifact[]
  ): CapabilityReleasePackage {
    if (certificate.status !== "certified") {
      throw new Error("Capability must be certified before packaging.");
    }

    const item: CapabilityReleasePackage = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      certificateId: certificate.id,
      packageName: `avos-capability-${blueprint.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      version: blueprint.version,
      artifactIds: artifacts.map((artifact) => artifact.id),
      status: "ready",
      createdAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  list(limit = 100): CapabilityReleasePackage[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
