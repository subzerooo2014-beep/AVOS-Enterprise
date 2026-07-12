import {
  V5BusinessRuntimeInput,
  V5KpiDefinition,
} from "./contracts";

export class V5RevenueAnalyticsGenerator {
  kpis(input: V5BusinessRuntimeInput): V5KpiDefinition[] {
    const base: V5KpiDefinition[] = [
      {
        key: "gross-marketplace-value",
        category: "revenue",
        formula: "sum(transaction.total)",
        refreshMinutes: 15,
      },
      {
        key: "net-platform-revenue",
        category: "revenue",
        formula: "sum(commission.amount)-sum(refund.amount)",
        refreshMinutes: 15,
      },
      {
        key: "settlement-success-rate",
        category: "operations",
        formula: "successful_settlements/total_settlements*100",
        refreshMinutes: 30,
      },
      {
        key: "fraud-loss-rate",
        category: "risk",
        formula: "fraud_losses/gross_marketplace_value*100",
        refreshMinutes: 60,
      },
      {
        key: "customer-conversion-rate",
        category: "customer",
        formula: "converted_customers/qualified_leads*100",
        refreshMinutes: 60,
      },
    ];

    return input.enableRevenueIntelligence === false
      ? base.filter((item) => item.category !== "revenue")
      : base;
  }

  dashboard(input: V5BusinessRuntimeInput) {
    return {
      title: `${input.systemKey} Executive Business Dashboard`,
      sections: [
        "revenue overview",
        "marketplace performance",
        "settlement health",
        "risk and fraud",
        "customer growth",
        "partner performance",
      ],
      dimensions: [
        "tenant",
        "marketplace-domain",
        "partner",
        "country",
        "time",
      ],
      drillDownEnabled: true,
    };
  }
}
