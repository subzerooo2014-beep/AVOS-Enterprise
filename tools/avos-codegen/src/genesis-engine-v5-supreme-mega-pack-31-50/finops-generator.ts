import {
  V5FinOpsPlan,
  V5SupremeRuntimeInput,
} from "./contracts";

export class V5FinOpsGenerator {
  generate(input: V5SupremeRuntimeInput): V5FinOpsPlan {
    return {
      monthlyBudget: input.monthlyBudget,
      allocationKeys: [
        "tenant",
        "service",
        "region",
        "environment",
        "product",
      ],
      anomalyThresholdPercent: 20,
      forecastHorizonMonths: 12,
    };
  }

  optimization(input: V5SupremeRuntimeInput) {
    return {
      enabled: input.enableFinOps !== false,
      recommendations: [
        "rightsizing",
        "reserved-capacity",
        "storage-tiering",
        "idle-resource-removal",
        "data-egress-optimization",
      ],
      savingsTargetPercent: 15,
      chargebackEnabled: true,
      showbackEnabled: true,
    };
  }
}
