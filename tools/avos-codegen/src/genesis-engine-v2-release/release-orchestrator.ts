import { randomUUID } from "node:crypto";
import {
  ReleaseArtifactDescriptor,
  ReleaseEvidence,
  ReleaseFinding,
  ReleaseSeverity,
  ReleaseStatus,
} from "./contracts";
import {
  GeneratedSystemReleaseManifest,
  ReleaseManifestFactory,
} from "./release-manifest";
import {
  EnterpriseBrainReleaseRegistration,
  EvolutionCenterReleaseRegistration,
  ReleaseRegistrationBuilder,
} from "./registration-builder";
import {
  ReleaseBump,
  SemanticVersionManager,
} from "./version-manager";

export interface ReleaseOrchestrationInput {
  systemKey: string;
  currentVersion: string;
  bump: ReleaseBump;
  workspaceDirectory: string;
  architectureStyle: string;
  capabilities: string[];
  artifacts: ReleaseArtifactDescriptor[];
  promotion: {
    approved: boolean;
    strategy: "promote" | "promote-with-controls" | "rollback";
    qualityScore: number;
    controls: string[];
  };
  previousVersion?: string | null;
}

export interface ReleaseOrchestrationResult {
  success: boolean;
  status: ReleaseStatus;
  releaseVersion: string | null;
  manifest: GeneratedSystemReleaseManifest | null;
  enterpriseBrainRegistration: EnterpriseBrainReleaseRegistration | null;
  evolutionCenterRegistration: EvolutionCenterReleaseRegistration | null;
  findings: ReleaseFinding[];
  evidence: ReleaseEvidence[];
  completedAt: string;
}

export class GenesisReleaseOrchestrator {
  constructor(
    readonly versions = new SemanticVersionManager(),
    readonly manifestFactory = new ReleaseManifestFactory(),
    readonly registrations = new ReleaseRegistrationBuilder(),
  ) {}

  execute(
    input: ReleaseOrchestrationInput,
  ): ReleaseOrchestrationResult {
    const findings: ReleaseFinding[] = [];

    if (!input.promotion.approved || input.promotion.strategy === "rollback") {
      findings.push({
        code: "GENESIS_RELEASE_PROMOTION_NOT_APPROVED",
        severity: ReleaseSeverity.ERROR,
        message: "Release cannot be created because promotion was not approved.",
        metadata: {
          strategy: input.promotion.strategy,
          qualityScore: input.promotion.qualityScore,
        },
      });

      return {
        success: false,
        status: ReleaseStatus.BLOCKED,
        releaseVersion: null,
        manifest: null,
        enterpriseBrainRegistration: null,
        evolutionCenterRegistration: null,
        findings,
        evidence: [
          {
            id: randomUUID(),
            category: "genesis-engine-v2-release",
            action: "release.blocked",
            message: "Generated system release was blocked.",
            metadata: {
              systemKey: input.systemKey,
              strategy: input.promotion.strategy,
            },
            createdAt: new Date().toISOString(),
          },
        ],
        completedAt: new Date().toISOString(),
      };
    }

    if (input.artifacts.length === 0) {
      findings.push({
        code: "GENESIS_RELEASE_ARTIFACTS_MISSING",
        severity: ReleaseSeverity.ERROR,
        message: "Release requires at least one generated artifact.",
        metadata: {},
      });
    }

    const releaseVersion = this.versions.next(
      input.currentVersion,
      input.bump,
    );

    const manifest =
      findings.length === 0
        ? this.manifestFactory.create({
            systemKey: input.systemKey,
            version: releaseVersion,
            strategy: input.promotion.strategy,
            qualityScore: input.promotion.qualityScore,
            workspaceDirectory: input.workspaceDirectory,
            artifacts: input.artifacts,
            controls: input.promotion.controls,
          })
        : null;

    const enterpriseBrainRegistration = manifest
      ? this.registrations.buildEnterpriseBrain(
          manifest,
          input.capabilities,
          input.architectureStyle,
        )
      : null;

    const evolutionCenterRegistration = manifest
      ? this.registrations.buildEvolutionCenter(
          manifest,
          input.previousVersion ?? null,
        )
      : null;

    const status =
      findings.length > 0
        ? ReleaseStatus.BLOCKED
        : input.promotion.qualityScore >= 90
          ? ReleaseStatus.READY
          : ReleaseStatus.DEGRADED;

    return {
      success: manifest !== null,
      status,
      releaseVersion: manifest?.version ?? null,
      manifest,
      enterpriseBrainRegistration,
      evolutionCenterRegistration,
      findings,
      evidence: [
        {
          id: randomUUID(),
          category: "genesis-engine-v2-release",
          action: "release.created",
          message: `Generated system release ${releaseVersion} created.`,
          metadata: {
            systemKey: input.systemKey,
            version: releaseVersion,
            qualityScore: input.promotion.qualityScore,
            strategy: input.promotion.strategy,
            artifactCount: input.artifacts.length,
            status,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}
