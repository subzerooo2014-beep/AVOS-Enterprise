import { BadRequestException, Injectable } from "@nestjs/common";
import { CoreFlowChangeService } from "./core-flow-change.service";
import { CoreFlowImpactService } from "./core-flow-impact.service";
import { CoreFlowReleaseGateService } from "./core-flow-release-gate.service";
import { CoreFlowRollbackPlanService } from "./core-flow-rollback-plan.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowChangeGovernanceService {
  constructor(
    private readonly changes: CoreFlowChangeService,
    private readonly impact: CoreFlowImpactService,
    private readonly gates: CoreFlowReleaseGateService,
    private readonly rollbackPlans: CoreFlowRollbackPlanService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  evaluate(changeId: string, dto: any = {}) {
    const assessment = this.impact.assess(changeId, dto);
    const rollbackPlan = this.rollbackPlans.create(
      changeId,
      Array.isArray(dto?.rollbackActions) ? dto.rollbackActions : [],
    );

    const defaultGates = [
      "build",
      "verification",
      "smoke",
      "security",
      "rollback-readiness",
    ];

    const gates = defaultGates.map((name) =>
      this.gates.create(changeId, name),
    );

    const audit = this.audit.write(changeId, "change.governance-evaluated", {
      severity: assessment.severity,
      gates: gates.map((gate) => gate.name),
    });

    return { assessment, rollbackPlan, gates, audit };
  }

  approve(changeId: string) {
    const readiness = this.gates.allPassed(changeId);
    const rollbackPlans = this.rollbackPlans.findAll(changeId);
    const rollbackReady = rollbackPlans.some((plan) => plan.tested);

    if (!readiness.ready || !rollbackReady) {
      throw new BadRequestException(
        "Change is not ready: release gates and tested rollback plan are required.",
      );
    }

    const change = this.changes.approve(changeId);
    this.audit.write(changeId, "change.approved");
    return { change, readiness, rollbackReady };
  }

  dashboard() {
    return {
      changes: this.changes.findAll(),
      impacts: this.impact.findAll(),
      gates: this.gates.findAll(),
      rollbackPlans: this.rollbackPlans.findAll(),
      generatedAt: new Date().toISOString(),
    };
  }
}
