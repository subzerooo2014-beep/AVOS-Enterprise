import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowContinuityPlan } from "./core-flow-sovereignty.types";
import { CoreFlowSovereignZoneService } from "./core-flow-sovereign-zone.service";

@Injectable()
export class CoreFlowContinuityService {
  private readonly plans = new Map<string, FlowContinuityPlan>();

  constructor(private readonly zones: CoreFlowSovereignZoneService) {}

  create(dto: any) {
    this.zones.findOne(dto?.primaryZoneId);
    this.zones.findOne(dto?.secondaryZoneId);

    const plan: FlowContinuityPlan = {
      id: `continuity_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      primaryZoneId: String(dto?.primaryZoneId),
      secondaryZoneId: String(dto?.secondaryZoneId),
      recoveryPointObjectiveMinutes: Math.max(
        Number(dto?.recoveryPointObjectiveMinutes ?? 15),
        1,
      ),
      recoveryTimeObjectiveMinutes: Math.max(
        Number(dto?.recoveryTimeObjectiveMinutes ?? 60),
        1,
      ),
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  findAll(flow?: string) {
    return Array.from(this.plans.values())
      .filter((plan) => !flow || plan.flow === flow)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const plan = this.plans.get(id);
    if (!plan) throw new NotFoundException("Continuity plan not found");
    return plan;
  }

  activate(id: string) {
    const plan = this.findOne(id);
    plan.status = "active";
    return plan;
  }

  test(id: string, dto: any = {}) {
    const plan = this.findOne(id);
    const simulatedRecoveryMinutes = Math.max(
      Number(dto?.simulatedRecoveryMinutes ?? plan.recoveryTimeObjectiveMinutes),
      1,
    );
    const simulatedDataLossMinutes = Math.max(
      Number(dto?.simulatedDataLossMinutes ?? plan.recoveryPointObjectiveMinutes),
      0,
    );

    const passed =
      simulatedRecoveryMinutes <= plan.recoveryTimeObjectiveMinutes &&
      simulatedDataLossMinutes <= plan.recoveryPointObjectiveMinutes;

    plan.status = "tested";
    plan.testedAt = new Date().toISOString();

    return {
      plan,
      passed,
      simulatedRecoveryMinutes,
      simulatedDataLossMinutes,
      testedAt: plan.testedAt,
    };
  }
}
