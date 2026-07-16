import { Injectable, NotFoundException } from "@nestjs/common";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type { RuntimeRecoveryPlanV1 } from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class RuntimeRecoveryCoordinatorV1Service {
  private readonly plans = new Map<string, RuntimeRecoveryPlanV1>();

  constructor(private readonly services: RuntimeServiceRegistryV1Service) {}

  create(
    serviceId: string,
    strategy: RuntimeRecoveryPlanV1["strategy"],
  ): RuntimeRecoveryPlanV1 {
    this.services.get(serviceId);
    const now = new Date().toISOString();

    const stepsByStrategy: Record<RuntimeRecoveryPlanV1["strategy"], string[]> = {
      RESTART: ["quiesce", "stop", "start", "verify"],
      FAILOVER: ["identify-replica", "promote-replica", "redirect-traffic", "verify"],
      ISOLATE: ["remove-from-routing", "quarantine", "diagnose", "verify"],
      ROLLBACK: ["select-release", "rollback", "restart", "verify"],
    };

    const plan: RuntimeRecoveryPlanV1 = {
      id: `runtime-recovery-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      serviceId,
      strategy,
      status: "CREATED",
      steps: [...stepsByStrategy[strategy]],
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return this.clone(plan);
  }

  execute(id: string): RuntimeRecoveryPlanV1 {
    const plan = this.requirePlan(id);
    plan.status = "EXECUTING";
    plan.updatedAt = new Date().toISOString();

    this.services.transition(plan.serviceId, "STARTING");
    this.services.transition(plan.serviceId, "READY");

    plan.status = "COMPLETED";
    plan.updatedAt = new Date().toISOString();
    return this.clone(plan);
  }

  list(): RuntimeRecoveryPlanV1[] {
    return Array.from(this.plans.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.plans.size;
  }

  completedCount(): number {
    return this.list().filter((item) => item.status === "COMPLETED").length;
  }

  private requirePlan(id: string): RuntimeRecoveryPlanV1 {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Recovery plan '${id}' was not found.`);
    }

    return plan;
  }

  private clone(item: RuntimeRecoveryPlanV1): RuntimeRecoveryPlanV1 {
    return {
      ...item,
      steps: [...item.steps],
    };
  }
}
