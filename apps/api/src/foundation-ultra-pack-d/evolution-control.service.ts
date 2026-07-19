import { Injectable } from "@nestjs/common";
import {
  EvolutionExecution,
  EvolutionProposal,
} from "./foundation-ultra-pack-d.types";
import { FoundationUltraPackDFileStoreService } from "./foundation-ultra-pack-d-file-store.service";
import { ArchitectureIntelligenceService } from "./architecture-intelligence.service";

@Injectable()
export class EvolutionControlService {
  constructor(
    private readonly store: FoundationUltraPackDFileStoreService,
    private readonly architecture: ArchitectureIntelligenceService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  propose(
    input: Omit<
      EvolutionProposal,
      | "id"
      | "status"
      | "impactAnalysisId"
      | "approvedBy"
      | "createdAt"
      | "updatedAt"
    >,
  ): EvolutionProposal {
    const analysis = this.architecture.analyzeImpact(
      this.id("change"),
      input.targetAssetId,
    );

    const timestamp = this.now();
    const proposal: EvolutionProposal = {
      ...input,
      id: this.id("evolution-proposal"),
      status: "proposed",
      requiresHumanApproval:
        input.requiresHumanApproval ||
        analysis.requiresHumanApproval ||
        input.changeType === "major" ||
        input.changeType === "migration",
      impactAnalysisId: analysis.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`evolution-proposals/${proposal.id}.json`, proposal);
    return proposal;
  }

  listProposals(): EvolutionProposal[] {
    return this.store.listJson<EvolutionProposal>("evolution-proposals");
  }

  approve(
    proposalId: string,
    approvedBy: string,
  ): EvolutionProposal {
    const proposal = this.listProposals().find(
      (item) => item.id === proposalId,
    );

    if (!proposal) {
      throw new Error(`Evolution proposal not found: ${proposalId}`);
    }

    if (
      proposal.requiresHumanApproval &&
      !approvedBy.startsWith("human:")
    ) {
      throw new Error(
        "This evolution proposal requires Human Final Authority.",
      );
    }

    const updated: EvolutionProposal = {
      ...proposal,
      status: "approved",
      approvedBy,
      updatedAt: this.now(),
    };

    this.store.writeJson(`evolution-proposals/${updated.id}.json`, updated);
    return updated;
  }

  execute(proposalId: string): EvolutionExecution {
    const proposal = this.listProposals().find(
      (item) => item.id === proposalId,
    );

    if (!proposal) {
      throw new Error(`Evolution proposal not found: ${proposalId}`);
    }

    if (proposal.status !== "approved") {
      throw new Error("Evolution proposal must be approved before execution.");
    }

    const checkpoints: EvolutionExecution["checkpoints"] = [
      {
        name: "impact-analysis",
        status: proposal.impactAnalysisId ? "passed" : "failed",
        evidence: proposal.impactAnalysisId,
      },
      {
        name: "rollback-plan",
        status: proposal.rollbackPlan.length > 0 ? "passed" : "failed",
        evidence: proposal.rollbackPlan.join(" | "),
      },
      {
        name: "execution-plan",
        status: proposal.executionPlan.length > 0 ? "passed" : "failed",
        evidence: proposal.executionPlan.join(" | "),
      },
      {
        name: "human-approval",
        status:
          !proposal.requiresHumanApproval ||
          Boolean(proposal.approvedBy?.startsWith("human:"))
            ? "passed"
            : "failed",
        evidence: proposal.approvedBy,
      },
    ];

    const passed = checkpoints.every(
      (checkpoint) => checkpoint.status === "passed",
    );

    const execution: EvolutionExecution = {
      id: this.id("evolution-execution"),
      proposalId,
      status: passed ? "completed" : "failed",
      checkpoints,
      startedAt: this.now(),
      completedAt: this.now(),
    };

    this.store.writeJson(`evolution-executions/${execution.id}.json`, execution);

    const updatedProposal: EvolutionProposal = {
      ...proposal,
      status: passed ? "completed" : "rejected",
      evidence: [
        ...proposal.evidence,
        `execution:${execution.id}`,
      ],
      updatedAt: this.now(),
    };

    this.store.writeJson(
      `evolution-proposals/${updatedProposal.id}.json`,
      updatedProposal,
    );

    return execution;
  }

  rollback(
    proposalId: string,
    approvedBy: string,
  ): EvolutionExecution {
    const proposal = this.listProposals().find(
      (item) => item.id === proposalId,
    );

    if (!proposal) {
      throw new Error(`Evolution proposal not found: ${proposalId}`);
    }

    if (!approvedBy.startsWith("human:")) {
      throw new Error("Rollback requires Human Final Authority.");
    }

    if (proposal.rollbackPlan.length === 0) {
      throw new Error("Rollback plan is missing.");
    }

    const execution: EvolutionExecution = {
      id: this.id("rollback-execution"),
      proposalId,
      status: "rolled-back",
      checkpoints: proposal.rollbackPlan.map((step) => ({
        name: step,
        status: "passed",
        evidence: `approvedBy=${approvedBy}`,
      })),
      startedAt: this.now(),
      completedAt: this.now(),
    };

    this.store.writeJson(`evolution-executions/${execution.id}.json`, execution);

    const updatedProposal: EvolutionProposal = {
      ...proposal,
      status: "rolled-back",
      approvedBy,
      evidence: [
        ...proposal.evidence,
        `rollback:${execution.id}`,
      ],
      updatedAt: this.now(),
    };

    this.store.writeJson(
      `evolution-proposals/${updatedProposal.id}.json`,
      updatedProposal,
    );

    return execution;
  }

  listExecutions(): EvolutionExecution[] {
    return this.store.listJson<EvolutionExecution>("evolution-executions");
  }
}