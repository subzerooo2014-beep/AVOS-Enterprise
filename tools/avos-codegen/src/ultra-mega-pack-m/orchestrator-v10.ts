import { randomUUID } from "node:crypto";
import {
  UltraMEvidence,
  UltraMFinding,
  UltraMSeverity,
  UltraMStatus,
  UltraMValue,
} from "./contracts";
import {
  AutonomyClause,
  AutonomyRequest,
  EnterpriseAutonomyConstitution,
  EnterpriseAutonomyConstitutionResult,
} from "./autonomy-constitution";
import {
  GlobalTrustFabric,
  GlobalTrustFabricResult,
  TrustFabricNode,
} from "./global-trust-fabric";
import {
  AutonomousTreasuryIntelligence,
  AutonomousTreasuryIntelligenceResult,
  TreasuryAccount,
  TreasuryAllocationTarget,
} from "./treasury-intelligence";
import {
  CivilizationEvolutionArchive,
  CivilizationEvolutionArchiveSnapshot,
} from "./civilization-evolution-archive";
import {
  AvosSupremeCoordinationResult,
  AvosSupremeCoordinationRuntime,
  SupremeRuntime,
} from "./supreme-coordination-runtime";

export interface SupremeOrchestrationInput {
  systemKey: string;
  autonomyRequest: AutonomyRequest;
  autonomyClauses: AutonomyClause[];
  trustNodes: TrustFabricNode[];
  treasuryAccounts: TreasuryAccount[];
  treasuryTargets: TreasuryAllocationTarget[];
  archiveEntries: Array<{
    key: string;
    payload: Record<string, UltraMValue>;
  }>;
  supremeRuntimes: SupremeRuntime[];
}

export interface SupremeOrchestrationResult {
  success: boolean;
  status: UltraMStatus;
  score: number;
  autonomy: EnterpriseAutonomyConstitutionResult;
  trust: GlobalTrustFabricResult;
  treasury: AutonomousTreasuryIntelligenceResult;
  archive: CivilizationEvolutionArchiveSnapshot;
  supreme: AvosSupremeCoordinationResult;
  findings: UltraMFinding[];
  evidence: UltraMEvidence[];
  completedAt: string;
}

export class EnterpriseSupremeOrchestratorV10 {
  constructor(
    readonly autonomy = new EnterpriseAutonomyConstitution(),
    readonly trust = new GlobalTrustFabric(),
    readonly treasury = new AutonomousTreasuryIntelligence(),
    readonly archive = new CivilizationEvolutionArchive(),
    readonly supreme = new AvosSupremeCoordinationRuntime(),
  ) {}

  execute(input: SupremeOrchestrationInput): SupremeOrchestrationResult {
    const autonomy = this.autonomy.evaluate(
      input.autonomyRequest,
      input.autonomyClauses,
    );
    const trust = this.trust.evaluate(input.trustNodes);
    const treasury = this.treasury.optimize(
      input.treasuryAccounts,
      input.treasuryTargets,
    );

    for (const entry of input.archiveEntries) {
      this.archive.append(entry.key, entry.payload);
    }

    const archive = this.archive.snapshot();
    const supreme = this.supreme.coordinate(input.supremeRuntimes);

    const findings: UltraMFinding[] = [
      ...autonomy.findings,
      ...supreme.findings,
    ];

    if (trust.untrustedNodes > 0) {
      findings.push({
        code: "GLOBAL_TRUST_FABRIC_UNTRUSTED_NODES",
        severity: UltraMSeverity.ERROR,
        message: "Global trust fabric contains untrusted nodes.",
        metadata: { untrustedNodes: trust.untrustedNodes },
      });
    }

    if (!archive.lineageVerified) {
      findings.push({
        code: "EVOLUTION_ARCHIVE_LINEAGE_FAILED",
        severity: UltraMSeverity.CRITICAL,
        message: "Civilization evolution archive lineage failed.",
        metadata: {},
      });
    }

    const treasuryFundingScore =
      input.treasuryTargets.length === 0
        ? 100
        : Math.round(
            (treasury.allocations.filter((item) => item.fullyFunded).length /
              input.treasuryTargets.length) *
              100,
          );

    const supremeScore = Math.round(
      (supreme.readinessScore + supreme.autonomyScore) / 2,
    );

    const score = Math.round(
      (
        autonomy.autonomyScore +
        trust.fabricTrustScore +
        treasury.liquidityScore +
        (archive.lineageVerified ? 100 : 0) +
        supremeScore
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraMSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraMSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraMStatus.BLOCKED
      : hasErrors || score < 70
        ? UltraMStatus.DEGRADED
        : UltraMStatus.READY;

    const success = status === UltraMStatus.READY;

    const evidence: UltraMEvidence[] = [
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-supreme-orchestrator-v10",
        action: "supreme-orchestration.completed",
        message: `Enterprise supreme orchestration completed with status ${status}.`,
        metadata: {
          score,
          autonomyApproved: autonomy.approved,
          fabricTrustScore: trust.fabricTrustScore,
          availableLiquidity: treasury.availableLiquidity,
          treasuryFundingScore,
          archiveRecords: archive.records,
          supremeReadiness: supreme.readinessScore,
          supremeAutonomy: supreme.autonomyScore,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      autonomy,
      trust,
      treasury,
      archive,
      supreme,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
