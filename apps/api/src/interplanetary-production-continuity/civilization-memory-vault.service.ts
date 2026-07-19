import { Injectable } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class CivilizationMemoryVaultService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  status() {
    return {
      artifacts: this.store.memoryArtifacts.length,
      immutableArtifacts: this.store.memoryArtifacts.filter((item) => item.immutable).length,
      replicatedTargets: Array.from(
        new Set(this.store.memoryArtifacts.flatMap((item) => item.replicationTargets)),
      ).length,
      multiNodeReplication: true,
      humanDestructionAuthorityRequired: true,
      legacyEngineCompatible: true,
    };
  }
}