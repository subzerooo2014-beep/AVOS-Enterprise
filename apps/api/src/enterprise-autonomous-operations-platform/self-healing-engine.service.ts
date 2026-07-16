import { Injectable } from "@nestjs/common";
import { AiOperationsOrchestratorService } from "./ai-operations-orchestrator.service";
import type {
  HealingPolicyRecord,
  OperationsSignalRecord,
} from "./enterprise-autonomous-operations.types";

@Injectable()
export class SelfHealingEngineService {
  private readonly policies = new Map<string, HealingPolicyRecord>();

  constructor(private readonly orchestrator: AiOperationsOrchestratorService) {}

  register(policy: HealingPolicyRecord): HealingPolicyRecord {
    this.policies.set(policy.id, { ...policy });
    return { ...policy };
  }

  evaluate(signal: OperationsSignalRecord) {
    const matched = this.list().filter((policy) => {
      if (!policy.enabled || policy.signalMetric !== signal.metric) return false;
      if (policy.operator === "GT") return signal.value > policy.threshold;
      if (policy.operator === "GTE") return signal.value >= policy.threshold;
      if (policy.operator === "LT") return signal.value < policy.threshold;
      if (policy.operator === "LTE") return signal.value <= policy.threshold;
      return signal.value === policy.threshold;
    });

    return matched.map((policy) =>
      this.orchestrator.plan(
        `Self-healing action for ${signal.metric}`,
        policy.actionType,
        policy.target,
        { signalId: signal.id, value: signal.value },
      ),
    );
  }

  list(): HealingPolicyRecord[] {
    return Array.from(this.policies.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.policies.size;
  }
}
