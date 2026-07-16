import { Injectable } from "@nestjs/common";
import { KernelReadinessAssessment } from "../enterprise-kernel-mega-pack-1.types";
import { KernelStateService } from "../state/kernel-state.service";
import { KernelModuleRegistryService } from "../modules/kernel-module-registry.service";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelReadinessService {
  private readonly assessments =
    new Map<string, KernelReadinessAssessment>();

  constructor(
    private readonly state: KernelStateService,
    private readonly modules: KernelModuleRegistryService,
    private readonly audit: KernelAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const state = this.state.get();
    const required = this.modules.required();
    const activeRequired = required.filter(
      (module) => module.stage === "active"
    );

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (state.status !== "running") {
      blockers.push(
        `Kernel runtime is not running. Current state: ${state.status}.`
      );
    }

    for (const module of required) {
      if (module.stage !== "active") {
        blockers.push(
          `Required kernel module is not active: ${module.id}.`
        );
      }
    }

    const failedModules = this.modules.byStage(
      "failed"
    );

    for (const module of failedModules) {
      blockers.push(
        `Kernel module failed: ${module.id}.`
      );
    }

    const suspended = this.modules.byStage(
      "suspended"
    );

    for (const module of suspended) {
      warnings.push(
        `Kernel module is suspended: ${module.id}.`
      );
    }

    const runtimeScore =
      state.status === "running" ? 100 : 0;

    const moduleScore =
      required.length === 0
        ? 100
        : Number(
            (
              activeRequired.length /
              required.length *
              100
            ).toFixed(2)
          );

    const failurePenalty =
      failedModules.length * 20;

    const score = Math.max(
      0,
      Math.min(
        100,
        Number(
          (
            runtimeScore * 0.5 +
            moduleScore * 0.5 -
            failurePenalty
          ).toFixed(2)
        )
      )
    );

    const assessment: KernelReadinessAssessment = {
      id: `kernel-readiness:${Date.now()}:${
        this.assessments.size + 1
      }`,
      ready:
        blockers.length === 0 &&
        score >= 90,
      score,
      blockers,
      warnings,
      requiredModules: required.length,
      activeRequiredModules:
        activeRequired.length,
      runtimeStatus: state.status,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "readiness",
      action: "kernel-readiness-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome: assessment.ready
        ? "success"
        : "blocked",
      metadata: {
        score: assessment.score,
        blockers: assessment.blockers
      }
    });

    return assessment;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      ready: items.filter(
        (assessment) => assessment.ready
      ).length,
      latestScore: this.latest()?.score ?? 0
    };
  }
}
