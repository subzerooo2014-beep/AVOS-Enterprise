import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-economics.types.ts",
  "src/core-application-flows/core-flow-budget.service.ts",
  "src/core-application-flows/core-flow-chargeback.service.ts",
  "src/core-application-flows/core-flow-pricing-policy.service.ts",
  "src/core-application-flows/core-flow-unit-economics.service.ts",
  "src/core-application-flows/core-flow-economics.service.ts",
  "src/core-application-flows/core-flow-economics.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  budgetsReady: all.includes("CoreFlowBudgetService"),
  chargebacksReady: all.includes("CoreFlowChargebackService"),
  pricingReady: all.includes("CoreFlowPricingPolicyService"),
  unitEconomicsReady: all.includes("CoreFlowUnitEconomicsService"),
  economicsOrchestrationReady: all.includes("CoreFlowEconomicsService"),
  budgetProtectionReady: all.includes("Flow budget limit exceeded"),
  surgePricingReady: all.includes("surgeMultiplier"),
  marginReady: all.includes("marginPercent"),
  costIntegrationReady: all.includes("CoreFlowCostService"),
  auditIntegrationReady: all.includes("economics.settled"),
  controllerRegistered: all.includes("CoreFlowEconomicsController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle L — Mega Packs 251-275",
  version: "1.275.0",
  classification: "budgets-chargeback-pricing-unit-economics-cost-governance",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
