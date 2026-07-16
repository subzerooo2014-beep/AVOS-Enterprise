import { Injectable } from "@nestjs/common";
import { BrainMultiAgentHealthIndex } from "../enterprise-brain-mega-pack-5.types";
import { BrainAgentRegistryService } from "../agents/brain-agent-registry.service";
import { BrainCoordinationRuntimeService } from "../coordination/brain-coordination-runtime.service";
import { BrainDelegationService } from "../delegation/brain-delegation.service";
import { BrainConsensusService } from "../consensus/brain-consensus.service";
import { BrainConflictResolutionService } from "../conflict/brain-conflict-resolution.service";
import { BrainSupervisorService } from "../supervisor/brain-supervisor.service";
import { BrainAgentGovernanceService } from "../governance/brain-agent-governance.service";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainMultiAgentHealthService {
  private readonly indexes =
    new Map<string, BrainMultiAgentHealthIndex>();

  constructor(
    private readonly agents: BrainAgentRegistryService,
    private readonly coordination: BrainCoordinationRuntimeService,
    private readonly delegation: BrainDelegationService,
    private readonly consensus: BrainConsensusService,
    private readonly conflicts: BrainConflictResolutionService,
    private readonly supervisor: BrainSupervisorService,
    private readonly governance: BrainAgentGovernanceService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const agents = this.agents.summary();
    const coordination = this.coordination.summary();
    const delegation = this.delegation.summary();
    const consensus = this.consensus.summary();
    const conflicts = this.conflicts.summary();
    const supervisor = this.supervisor.summary();
    const governance = this.governance.summary();

    const registryScore =
      agents.total >= 3 ? 100 : 70;

    const availabilityScore =
      agents.total === 0
        ? 0
        : Number(
            (
              (
                agents.ready +
                agents.busy
              ) /
              agents.total *
              100
            ).toFixed(2)
          );

    const coordinationScore =
      coordination.total === 0
        ? 100
        : Number(
            (
              coordination.completed /
              coordination.total *
              100
            ).toFixed(2)
          );

    const delegationScore =
      delegation.total === 0
        ? 100
        : Number(
            (
              delegation.completed /
              delegation.total *
              100
            ).toFixed(2)
          );

    const consensusScore =
      consensus.total === 0
        ? 100
        : Math.max(
            0,
            100 - consensus.deadlock * 25
          );

    const conflictScore =
      conflicts.total === 0
        ? 100
        : Number(
            (
              conflicts.resolved /
              conflicts.total *
              100
            ).toFixed(2)
          );

    const supervisorScore =
      supervisor.total === 0
        ? 100
        : Number(
            (
              supervisor.executed /
              supervisor.total *
              100
            ).toFixed(2)
          );

    const governanceScore =
      governance.active === governance.total &&
      governance.mandatory >= 4
        ? 100
        : 70;

    const score = Number(
      (
        registryScore * 0.15 +
        availabilityScore * 0.15 +
        coordinationScore * 0.2 +
        delegationScore * 0.1 +
        consensusScore * 0.1 +
        conflictScore * 0.1 +
        supervisorScore * 0.1 +
        governanceScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (availabilityScore < 90) {
      reasons.push("Brain agent availability is below target.");
    }

    if (coordinationScore < 90) {
      reasons.push("Brain coordination completion is below target.");
    }

    if (delegationScore < 90) {
      reasons.push("Brain delegation completion is below target.");
    }

    if (consensusScore < 90) {
      reasons.push("Brain consensus contains deadlocks.");
    }

    if (conflictScore < 90) {
      reasons.push("Brain conflicts require resolution.");
    }

    if (supervisorScore < 90) {
      reasons.push("Supervisor decisions require execution.");
    }

    if (governanceScore < 90) {
      reasons.push("Brain agent governance coverage is incomplete.");
    }

    if (reasons.length === 0) {
      reasons.push("Enterprise Brain multi-agent core is healthy.");
    }

    const index: BrainMultiAgentHealthIndex = {
      id: `brain-multi-agent-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        registryScore,
        availabilityScore,
        coordinationScore,
        delegationScore,
        consensusScore,
        conflictScore,
        supervisorScore,
        governanceScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "brain-multi-agent-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): BrainMultiAgentHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
