import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DEFAULT_LAUNCH_CHECKLIST } from "./launch-readiness.registry";
import { ChecklistItem, TenantActivation } from "./launch-readiness.types";

@Injectable()
export class LaunchReadinessService {
  private readonly checklist = new Map<string, ChecklistItem>();
  private readonly activations = new Map<string, TenantActivation>();

  installChecklist(): ChecklistItem[] {
    return DEFAULT_LAUNCH_CHECKLIST.map((item) => {
      const existing = Array.from(this.checklist.values()).find((value) => value.key === item.key);
      if (existing) return { ...existing };

      const record: ChecklistItem = {
        id: randomUUID(),
        key: item.key,
        name: item.name,
        category: item.category,
        required: item.required,
        completed: false,
        updatedAt: new Date().toISOString(),
      };

      this.checklist.set(record.id, record);
      return { ...record };
    });
  }

  completeChecklistItem(id: string, evidence: string): ChecklistItem {
    const item = this.requireChecklistItem(id);
    item.completed = true;
    item.evidence = evidence;
    item.updatedAt = new Date().toISOString();
    this.checklist.set(id, item);
    return { ...item };
  }

  assessTenant(tenantId: string, environment: TenantActivation["environment"]): TenantActivation {
    const required = Array.from(this.checklist.values()).filter((item) => item.required);
    const completed = required.filter((item) => item.completed);
    const readinessScore = required.length === 0 ? 0 : Number(((completed.length / required.length) * 100).toFixed(2));
    const blockers = required.filter((item) => !item.completed).map((item) => item.name);
    const now = new Date().toISOString();

    const activation: TenantActivation = {
      id: randomUUID(),
      tenantId,
      environment,
      status: readinessScore === 100 ? "READY" : "BLOCKED",
      readinessScore,
      blockers,
      createdAt: now,
      updatedAt: now,
    };

    this.activations.set(activation.id, activation);
    return this.cloneActivation(activation);
  }

  activateTenant(id: string): TenantActivation {
    const activation = this.requireActivation(id);
    if (activation.status !== "READY" || activation.readinessScore < 100) {
      throw new Error("Tenant is not launch ready");
    }

    activation.status = "ACTIVE";
    activation.activatedAt = new Date().toISOString();
    activation.updatedAt = activation.activatedAt;
    this.activations.set(id, activation);
    return this.cloneActivation(activation);
  }

  dashboard() {
    const items = Array.from(this.checklist.values());
    const activations = Array.from(this.activations.values());

    return {
      checklistItems: items.length,
      completedItems: items.filter((item) => item.completed).length,
      tenantAssessments: activations.length,
      readyTenants: activations.filter((item) => item.status === "READY").length,
      activeTenants: activations.filter((item) => item.status === "ACTIVE").length,
      blockedTenants: activations.filter((item) => item.status === "BLOCKED").length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireChecklistItem(id: string): ChecklistItem {
    const value = this.checklist.get(id);
    if (!value) throw new Error(`Checklist item not found: ${id}`);
    return value;
  }

  private requireActivation(id: string): TenantActivation {
    const value = this.activations.get(id);
    if (!value) throw new Error(`Tenant activation not found: ${id}`);
    return value;
  }

  private cloneActivation(value: TenantActivation): TenantActivation {
    return { ...value, blockers: [...value.blockers] };
  }
}