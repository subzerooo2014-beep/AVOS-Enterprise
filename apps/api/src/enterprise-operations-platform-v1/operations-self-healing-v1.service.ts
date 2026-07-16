import { Injectable, NotFoundException } from "@nestjs/common";
import { OperationsIncidentManagerV1Service } from "./operations-incident-manager-v1.service";
import type { OperationsHealingActionV1 } from "./enterprise-operations-platform-v1.types";

@Injectable()
export class OperationsSelfHealingV1Service {
  private readonly actions = new Map<string, OperationsHealingActionV1>();

  constructor(private readonly incidents: OperationsIncidentManagerV1Service) {}

  plan(
    incidentId: string,
    serviceId: string,
    action: OperationsHealingActionV1["action"],
  ): OperationsHealingActionV1 {
    this.incidents.get(incidentId);
    const now = new Date().toISOString();

    const healingAction: OperationsHealingActionV1 = {
      id: `healing-action-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      incidentId,
      serviceId,
      action,
      status: "PLANNED",
      createdAt: now,
      updatedAt: now,
    };

    this.actions.set(healingAction.id, healingAction);
    return { ...healingAction };
  }

  execute(id: string): OperationsHealingActionV1 {
    const action = this.actions.get(id);

    if (!action) {
      throw new NotFoundException(`Healing action '${id}' was not found.`);
    }

    action.status = "EXECUTING";
    action.updatedAt = new Date().toISOString();
    action.status = "COMPLETED";
    action.result = `${action.action} completed for ${action.serviceId}.`;
    action.updatedAt = new Date().toISOString();

    this.incidents.transition(action.incidentId, "MITIGATED");

    return { ...action };
  }

  list(): OperationsHealingActionV1[] {
    return Array.from(this.actions.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.actions.size;
  }

  completedCount(): number {
    return this.list().filter((item) => item.status === "COMPLETED").length;
  }
}
