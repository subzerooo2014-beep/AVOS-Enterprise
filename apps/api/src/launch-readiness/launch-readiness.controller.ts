import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { LaunchOrchestratorService } from "./launch-orchestrator.service";
import { MonetizationService } from "./monetization.service";
import { LaunchReadinessService } from "./launch-readiness.service";
import { SupportSlaService } from "./support-sla.service";
import { LaunchMetricsService } from "./launch-metrics.service";
import { LaunchMetric, PricingPlan, Subscription, SupportCase, TenantActivation } from "./launch-readiness.types";

@Controller("launch-readiness")
export class LaunchReadinessController {
  constructor(
    private readonly launch: LaunchOrchestratorService,
    private readonly monetization: MonetizationService,
    private readonly readiness: LaunchReadinessService,
    private readonly support: SupportSlaService,
    private readonly metrics: LaunchMetricsService,
  ) {}

  @Get("capabilities")
  capabilities() { return this.launch.capabilities(); }

  @Post("plans")
  createPlan(@Body() input: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">) {
    return this.monetization.createPlan(input);
  }

  @Post("subscriptions")
  createSubscription(@Body() body: {
    tenantId: string;
    planId: string;
    billingCycle: Subscription["billingCycle"];
    seats: number;
    trialEndsAt?: string;
  }) {
    return this.monetization.createSubscription(
      body.tenantId,
      body.planId,
      body.billingCycle,
      body.seats,
      body.trialEndsAt,
    );
  }

  @Patch("subscriptions/:id/plan")
  changePlan(@Param("id") id: string, @Body() body: { planId: string; seats: number }) {
    return this.monetization.changePlan(id, body.planId, body.seats);
  }

  @Post("invoices")
  createInvoice(@Body() body: { subscriptionId: string; taxRate: number; dueAt: string }) {
    return this.monetization.createInvoice(body.subscriptionId, body.taxRate, body.dueAt);
  }

  @Patch("invoices/:id/pay")
  payInvoice(@Param("id") id: string) { return this.monetization.payInvoice(id); }

  @Post("checklist/install")
  installChecklist() { return this.readiness.installChecklist(); }

  @Patch("checklist/:id/complete")
  completeChecklistItem(@Param("id") id: string, @Body() body: { evidence: string }) {
    return this.readiness.completeChecklistItem(id, body.evidence);
  }

  @Post("tenants/assess")
  assessTenant(@Body() body: { tenantId: string; environment: TenantActivation["environment"] }) {
    return this.readiness.assessTenant(body.tenantId, body.environment);
  }

  @Patch("tenants/:id/activate")
  activateTenant(@Param("id") id: string) { return this.readiness.activateTenant(id); }

  @Post("support/cases")
  createSupportCase(
    @Body() input: Omit<SupportCase, "id" | "status" | "createdAt" | "updatedAt" | "resolvedAt">,
  ) {
    return this.support.createCase(input);
  }

  @Patch("support/cases/:id/status")
  updateSupportStatus(@Param("id") id: string, @Body() body: { status: SupportCase["status"] }) {
    return this.support.updateStatus(id, body.status);
  }

  @Post("metrics")
  recordMetric(@Body() input: Omit<LaunchMetric, "id" | "recordedAt">) {
    return this.metrics.record(input);
  }

  @Get("metrics/:tenantId/latest")
  latestMetrics(@Param("tenantId") tenantId: string) {
    return this.metrics.latest(tenantId);
  }

  @Get("dashboard")
  dashboard() { return this.launch.dashboard(); }
}