import {
  EvolutionControl,
  EvolutionProposal,
  EvolutionRiskAssessment,
  EvolutionRiskLevel,
} from "./contracts";

export class EvolutionRiskEngine {
  assess(
    proposal: EvolutionProposal,
  ): EvolutionRiskAssessment {
    const findings: string[] = [];
    const controls: EvolutionControl[] = [];

    let score = 0;

    score += Math.min(
      30,
      proposal.estimatedImpact * 3,
    );

    score += Math.min(
      20,
      proposal.estimatedEffort * 2,
    );

    score += Math.min(
      20,
      proposal.affectedCapabilities.length * 2,
    );

    score += Math.min(
      15,
      proposal.affectedBlueprints.length * 3,
    );

    score += Math.min(
      15,
      proposal.knownRisks.length * 3,
    );

    if (
      proposal.dependencies.length > 8
    ) {
      score += 10;
      findings.push(
        "Proposal has a high dependency count.",
      );
    }

    if (
      proposal.affectedBlueprints.length > 0
    ) {
      controls.push({
        key: "blueprint-compatibility-check",
        name: "Blueprint Compatibility Check",
        description:
          "Validate every affected blueprint before execution.",
        mandatory: true,
        evidenceRequired: true,
        metadata: {},
      });
    }

    if (
      proposal.estimatedImpact >= 8
    ) {
      controls.push({
        key: "architecture-review",
        name: "Architecture Review",
        description:
          "Require architecture review for high-impact evolution.",
        mandatory: true,
        evidenceRequired: true,
        metadata: {},
      });

      findings.push(
        "Proposal has high estimated platform impact.",
      );
    }

    if (
      proposal.knownRisks.length >= 3
    ) {
      controls.push({
        key: "rollback-plan",
        name: "Rollback Plan",
        description:
          "Require a tested rollback plan before execution.",
        mandatory: true,
        evidenceRequired: true,
        metadata: {},
      });

      findings.push(
        "Proposal declares multiple known risks.",
      );
    }

    const normalizedScore =
      Math.max(
        0,
        Math.min(100, score),
      );

    return {
      proposalId: proposal.id,
      score: normalizedScore,
      level: this.levelFor(
        normalizedScore,
      ),
      findings,
      controls,
      assessedAt:
        new Date().toISOString(),
    };
  }

  private levelFor(
    score: number,
  ): EvolutionRiskLevel {
    if (score >= 80) {
      return EvolutionRiskLevel.CRITICAL;
    }

    if (score >= 60) {
      return EvolutionRiskLevel.HIGH;
    }

    if (score >= 30) {
      return EvolutionRiskLevel.MEDIUM;
    }

    return EvolutionRiskLevel.LOW;
  }
}
