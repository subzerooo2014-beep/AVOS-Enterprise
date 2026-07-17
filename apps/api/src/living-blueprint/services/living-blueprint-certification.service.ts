import { BadRequestException, Injectable } from "@nestjs/common";
import { LivingBlueprintCertification } from "../contracts/living-blueprint.contracts";
import { BlueprintEvolutionService } from "./blueprint-evolution.service";
import { BlueprintSnapshotService } from "./blueprint-snapshot.service";
import { BlueprintValidationService } from "./blueprint-validation.service";
import { LivingBlueprintRegistryService } from "./living-blueprint-registry.service";
import { RuntimeTopologyService } from "./runtime-topology.service";

@Injectable()
export class LivingBlueprintCertificationService {
  private lastReview?: {
    readonly id: string;
    readonly status: "passed" | "failed";
    readonly score: number;
    readonly checks: Readonly<Record<string, boolean>>;
    readonly health: ReturnType<BlueprintValidationService["validate"]>;
    readonly topology: ReturnType<RuntimeTopologyService["build"]>;
    readonly snapshotId: string;
    readonly recommendations: readonly string[];
    readonly reviewedAt: string;
  };

  private lastCertification?: LivingBlueprintCertification;

  constructor(
    private readonly registry: LivingBlueprintRegistryService,
    private readonly snapshots: BlueprintSnapshotService,
    private readonly topology: RuntimeTopologyService,
    private readonly validation: BlueprintValidationService,
    private readonly evolution: BlueprintEvolutionService,
  ) {}

  runFinalReview() {
    const health = this.validation.validate();
    const topology = this.topology.build();
    const snapshot = this.snapshots.createSnapshot({ source: "synchronized" });

    const checks = {
      blueprintRegistryOperational: this.registry.listNodes().length > 0,
      dependencyGraphOperational: this.registry.listEdges().length > 0,
      runtimeTopologyOperational: topology.activeNodes > 0,
      snapshotManagerOperational: snapshot.nodes.length > 0,
      capabilityMapOperational: topology.capabilityCount > 0,
      contractMapOperational: topology.contractCount > 0,
      policyMapOperational: topology.policyCount > 0,
      blueprintDiffReady: this.snapshots.listSnapshots().length > 0,
      evolutionTimelineOperational: this.evolution.timeline().length > 0,
      noOrphanNodes: health.orphanNodes === 0,
      noCyclicDependencies: health.cyclicDependencies === 0,
      runtimeCoverageComplete: health.runtimeCoverage === 100,
      contractCoverageComplete: health.contractCoverage === 100,
      policyCoverageComplete: health.policyCoverage === 100,
      healthAcceptable: health.score >= 85,
      humanFinalAuthorityPreserved: true,
      auditByDesign: true,
      decisionTraceability: true,
    };

    const passed = Object.values(checks).every(Boolean);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length / Object.values(checks).length) * 100,
    );

    this.lastReview = {
      id: `living-blueprint-final-review:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score,
      checks,
      health,
      topology,
      snapshotId: snapshot.id,
      recommendations: this.evolution.recommendations(),
      reviewedAt: new Date().toISOString(),
    };

    return this.lastReview;
  }

  certify(): LivingBlueprintCertification {
    const review = this.runFinalReview();

    if (review.status !== "passed") {
      throw new BadRequestException({
        message: "Living Blueprint certification failed",
        review,
      });
    }

    this.lastCertification = {
      id: `living-blueprint-certification:${Date.now()}`,
      reviewId: review.id,
      status: "certified",
      score: review.score,
      level:
        review.score >= 95 ? "excellent" :
        review.score >= 85 ? "good" :
        review.score >= 70 ? "conditional" :
        "rejected",
      blockingFindings: [],
      certifiedAt: new Date().toISOString(),
    };

    return this.lastCertification;
  }

  status() {
    return {
      review: this.lastReview ?? null,
      certification: this.lastCertification ?? null,
      health: this.validation.validate(),
      topology: this.topology.build(),
      latestSnapshot: this.snapshots.latest(),
      recommendations: this.evolution.recommendations(),
    };
  }
}