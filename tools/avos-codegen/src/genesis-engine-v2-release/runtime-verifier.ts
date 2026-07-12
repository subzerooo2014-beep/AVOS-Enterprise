import { ReleaseOrchestrationResult } from "./release-orchestrator";

export interface GenesisReleaseHealth {
  healthy: boolean;
  status: string;
  releaseVersion: string | null;
  artifactCount: number;
  qualityScore: number;
  enterpriseBrainRegistered: boolean;
  evolutionCenterRegistered: boolean;
  rollbackSupported: boolean;
  findingCount: number;
  evidenceCount: number;
}

export class GenesisReleaseRuntimeVerifier {
  verify(result: ReleaseOrchestrationResult): GenesisReleaseHealth {
    return {
      healthy:
        result.success &&
        result.manifest !== null &&
        result.enterpriseBrainRegistration !== null &&
        result.evolutionCenterRegistration !== null &&
        result.manifest.artifacts.length > 0 &&
        result.manifest.artifactIndexHash.length === 64,
      status: result.status,
      releaseVersion: result.releaseVersion,
      artifactCount: result.manifest?.artifacts.length ?? 0,
      qualityScore: result.manifest?.qualityScore ?? 0,
      enterpriseBrainRegistered:
        result.enterpriseBrainRegistration !== null,
      evolutionCenterRegistered:
        result.evolutionCenterRegistration !== null,
      rollbackSupported:
        result.evolutionCenterRegistration?.rollback.supported ?? false,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
