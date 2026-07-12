import { GeneratedSystemReleaseManifest } from "./release-manifest";

export interface EnterpriseBrainReleaseRegistration {
  type: "generated-system-release";
  systemKey: string;
  version: string;
  releaseId: string;
  capabilities: string[];
  architectureStyle: string;
  qualityScore: number;
  artifactIndexHash: string;
}

export interface EvolutionCenterReleaseRegistration {
  type: "generated-system-baseline";
  systemKey: string;
  version: string;
  releaseId: string;
  baseline: {
    qualityScore: number;
    artifactCount: number;
    strategy: string;
    controls: string[];
  };
  rollback: {
    supported: boolean;
    previousVersion: string | null;
  };
}

export class ReleaseRegistrationBuilder {
  buildEnterpriseBrain(
    manifest: GeneratedSystemReleaseManifest,
    capabilities: readonly string[],
    architectureStyle: string,
  ): EnterpriseBrainReleaseRegistration {
    return {
      type: "generated-system-release",
      systemKey: manifest.systemKey,
      version: manifest.version,
      releaseId: manifest.releaseId,
      capabilities: [...capabilities],
      architectureStyle,
      qualityScore: manifest.qualityScore,
      artifactIndexHash: manifest.artifactIndexHash,
    };
  }

  buildEvolutionCenter(
    manifest: GeneratedSystemReleaseManifest,
    previousVersion: string | null,
  ): EvolutionCenterReleaseRegistration {
    return {
      type: "generated-system-baseline",
      systemKey: manifest.systemKey,
      version: manifest.version,
      releaseId: manifest.releaseId,
      baseline: {
        qualityScore: manifest.qualityScore,
        artifactCount: manifest.artifacts.length,
        strategy: manifest.strategy,
        controls: [...manifest.controls],
      },
      rollback: {
        supported: previousVersion !== null,
        previousVersion,
      },
    };
  }
}
