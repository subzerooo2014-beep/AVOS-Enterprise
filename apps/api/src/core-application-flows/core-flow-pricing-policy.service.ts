import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowPricingPolicy } from "./core-flow-economics.types";

@Injectable()
export class CoreFlowPricingPolicyService {
  private readonly policies = new Map<string, FlowPricingPolicy>();

  create(dto: any) {
    for (const policy of this.policies.values()) {
      if (policy.flow === dto?.flow) policy.active = false;
    }

    const policy: FlowPricingPolicy = {
      id: `pricing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      basePrice: Math.max(Number(dto?.basePrice ?? 0), 0),
      unitPrice: Math.max(Number(dto?.unitPrice ?? 0), 0),
      surgeMultiplier: Math.max(Number(dto?.surgeMultiplier ?? 1), 1),
      currency: String(dto?.currency ?? "AED"),
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.policies.set(policy.id, policy);
    return policy;
  }

  findAll(flow?: string) {
    return Array.from(this.policies.values())
      .filter((item) => !flow || item.flow === flow)
      .slice()
      .reverse();
  }

  active(flow: string) {
    const policy = Array.from(this.policies.values()).find(
      (item) => item.flow === flow && item.active,
    );
    if (!policy) throw new NotFoundException("Active flow pricing policy not found");
    return policy;
  }

  calculate(flow: string, units: number, surge = false) {
    const policy = this.active(flow);
    const normalizedUnits = Math.max(Number(units || 0), 0);
    const multiplier = surge ? policy.surgeMultiplier : 1;
    const amount = (policy.basePrice + policy.unitPrice * normalizedUnits) * multiplier;

    return {
      flow,
      units: normalizedUnits,
      surge,
      multiplier,
      amount: Number(amount.toFixed(4)),
      currency: policy.currency,
      policyId: policy.id,
      calculatedAt: new Date().toISOString(),
    };
  }
}
