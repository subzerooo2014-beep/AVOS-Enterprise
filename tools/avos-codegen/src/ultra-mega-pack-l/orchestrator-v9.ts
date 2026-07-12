import { randomUUID } from "node:crypto";
import {
  UltraLEvidence,
  UltraLFinding,
  UltraLSeverity,
  UltraLStatus,
  UltraLValue,
} from "./contracts";
import {
  EnterpriseSovereigntyKernel,
  SovereigntyDecision,
  SovereigntyRequest,
  SovereigntyRule,
} from "./sovereignty-kernel";
import {
  AutonomousTrustNetwork,
  AutonomousTrustNetworkResult,
  TrustNode,
} from "./autonomous-trust-network";
import {
  UniversalValueExchange,
  UniversalValueExchangeResult,
  ValueAccount,
  ValueTransfer,
} from "./universal-value-exchange";
import {
  CivilizationKnowledgeArchive,
  CivilizationKnowledgeArchiveSnapshot,
} from "./civilization-knowledge-archive";
import {
  AvosMetaGovernanceRuntime,
  GovernanceConstitution,
  MetaGovernanceDecision,
} from "./meta-governance-runtime";

export interface MetaGovernanceOrchestrationInput {
  systemKey: string;
  sovereigntyRequest: SovereigntyRequest;
  sovereigntyRules: SovereigntyRule[];
  trustNodes: TrustNode[];
  valueAccounts: ValueAccount[];
  valueTransfers: ValueTransfer[];
  archiveEntries: Array<{
    key: string;
    category: string;
    payload: Record<string, UltraLValue>;
  }>;
  constitutions: GovernanceConstitution[];
}

export interface MetaGovernanceOrchestrationResult {
  success: boolean;
  status: UltraLStatus;
  score: number;
  sovereignty: SovereigntyDecision;
  trust: AutonomousTrustNetworkResult;
  valueExchange: UniversalValueExchangeResult;
  archive: CivilizationKnowledgeArchiveSnapshot;
  metaGovernance: MetaGovernanceDecision;
  findings: UltraLFinding[];
  evidence: UltraLEvidence[];
  completedAt: string;
}

export class EnterpriseMetaGovernanceOrchestratorV9 {
  constructor(
    readonly sovereignty = new EnterpriseSovereigntyKernel(),
    readonly trust = new AutonomousTrustNetwork(),
    readonly valueExchange = new UniversalValueExchange(),
    readonly archive = new CivilizationKnowledgeArchive(),
    readonly metaGovernance = new AvosMetaGovernanceRuntime(),
  ) {}

  execute(
    input: MetaGovernanceOrchestrationInput,
  ): MetaGovernanceOrchestrationResult {
    const sovereignty = this.sovereignty.evaluate(
      input.sovereigntyRequest,
      input.sovereigntyRules,
    );
    const trust = this.trust.assess(input.trustNodes);
    const valueExchange = this.valueExchange.settle(
      input.valueAccounts,
      input.valueTransfers,
    );

    for (const entry of input.archiveEntries) {
      this.archive.archive(entry.key, entry.category, entry.payload);
    }

    const archive = this.archive.snapshot();
    const metaGovernance = this.metaGovernance.decide(
      input.constitutions,
    );

    const findings: UltraLFinding[] = [
      ...sovereignty.findings,
      ...metaGovernance.findings,
    ];

    if (trust.untrustedNodes > 0) {
      findings.push({
        code: "TRUST_NETWORK_UNTRUSTED_NODES",
        severity: UltraLSeverity.ERROR,
        message: "Autonomous trust network contains untrusted nodes.",
        metadata: { untrustedNodes: trust.untrustedNodes },
      });
    }

    if (valueExchange.rejectedTransfers > 0) {
      findings.push({
        code: "VALUE_EXCHANGE_REJECTED_TRANSFERS",
        severity: UltraLSeverity.WARNING,
        message: "One or more value transfers were rejected.",
        metadata: {
          rejectedTransfers: valueExchange.rejectedTransfers,
        },
      });
    }

    if (!archive.integrityVerified) {
      findings.push({
        code: "CIVILIZATION_ARCHIVE_INTEGRITY_FAILED",
        severity: UltraLSeverity.CRITICAL,
        message: "Civilization knowledge archive integrity failed.",
        metadata: {},
      });
    }

    const exchangeScore =
      input.valueTransfers.length === 0
        ? 100
        : Math.round(
            (valueExchange.settlements.filter((item) => item.settled).length /
              input.valueTransfers.length) *
              100,
          );

    const archiveScore = archive.integrityVerified ? 100 : 0;

    const score = Math.round(
      (
        sovereignty.score +
        trust.networkTrustScore +
        exchangeScore +
        archiveScore +
        metaGovernance.score
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraLSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraLSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraLStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraLStatus.DEGRADED
        : UltraLStatus.READY;

    const success = status === UltraLStatus.READY;

    const evidence: UltraLEvidence[] = [
      ...sovereignty.evidence,
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-meta-governance-orchestrator-v9",
        action: "meta-governance.completed",
        message: `Enterprise meta-governance completed with status ${status}.`,
        metadata: {
          score,
          sovereigntyAllowed: sovereignty.allowed,
          networkTrustScore: trust.networkTrustScore,
          totalSettledValue: valueExchange.totalSettledValue,
          archiveRecords: archive.records,
          metaGovernanceApproved: metaGovernance.approved,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      sovereignty,
      trust,
      valueExchange,
      archive,
      metaGovernance,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
