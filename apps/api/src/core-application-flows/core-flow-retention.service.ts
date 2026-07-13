import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowRetentionPolicy } from "./core-flow-enterprise.types";

@Injectable()
export class CoreFlowRetentionService {
  private readonly policies = new Map<string, FlowRetentionPolicy>();

  create(dto: any) {
    const policy: FlowRetentionPolicy = {
      id: `retention_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(dto?.name ?? "default-retention"),
      retentionDays: Math.max(Number(dto?.retentionDays ?? 365), 1),
      purgeMode: dto?.purgeMode === "hard" ? "hard" : "soft",
      appliesTo: Array.isArray(dto?.appliesTo) ? dto.appliesTo : ["*"],
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.policies.set(policy.id, policy);
    return policy;
  }

  findAll() {
    return Array.from(this.policies.values()).slice().reverse();
  }

  findOne(id: string) {
    const policy = this.policies.get(id);
    if (!policy) throw new NotFoundException("Retention policy not found");
    return policy;
  }

  deactivate(id: string) {
    const policy = this.findOne(id);
    policy.active = false;
    return policy;
  }

  evaluate(policyId: string, createdAt: string) {
    const policy = this.findOne(policyId);
    const expiry =
      new Date(createdAt).getTime() +
      policy.retentionDays * 24 * 60 * 60 * 1000;

    return {
      policyId,
      expired: Date.now() >= expiry,
      expiresAt: new Date(expiry).toISOString(),
      purgeMode: policy.purgeMode,
    };
  }
}
