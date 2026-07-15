import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { SaasTenant } from "./enterprise-product-suites.types";

@Injectable()
export class GlobalSaasSuiteService {
  private readonly tenants = new Map<string, SaasTenant>();
  private readonly slugIndex = new Map<string, string>();

  createTenant(
    input: Omit<SaasTenant, "id" | "status" | "createdAt" | "updatedAt">,
  ): SaasTenant {
    if (this.slugIndex.has(input.slug)) {
      throw new Error(`SaaS tenant slug already exists: ${input.slug}`);
    }

    const now = new Date().toISOString();

    const tenant: SaasTenant = {
      ...input,
      id: randomUUID(),
      status: "TRIAL",
      createdAt: now,
      updatedAt: now,
    };

    this.tenants.set(tenant.id, tenant);
    this.slugIndex.set(tenant.slug, tenant.id);

    return { ...tenant };
  }

  activateTenant(id: string): SaasTenant {
    const tenant = this.requireTenant(id);
    tenant.status = "ACTIVE";
    tenant.updatedAt = new Date().toISOString();
    this.tenants.set(id, tenant);
    return { ...tenant };
  }

  changePlan(
    id: string,
    plan: SaasTenant["plan"],
    subscriptionAmount: number,
  ): SaasTenant {
    const tenant = this.requireTenant(id);

    if (subscriptionAmount < 0) {
      throw new Error("subscriptionAmount cannot be negative");
    }

    tenant.plan = plan;
    tenant.subscriptionAmount = subscriptionAmount;
    tenant.updatedAt = new Date().toISOString();
    this.tenants.set(id, tenant);

    return { ...tenant };
  }

  dashboard() {
    const tenants = Array.from(this.tenants.values());

    return {
      tenants: tenants.length,
      trials: tenants.filter((item) => item.status === "TRIAL").length,
      active: tenants.filter((item) => item.status === "ACTIVE").length,
      enterprise: tenants.filter((item) => item.plan === "ENTERPRISE").length,
      whiteLabel: tenants.filter((item) => item.whiteLabel).length,
      appStoreEnabled: tenants.filter((item) => item.appStoreEnabled).length,
      apiEnabled: tenants.filter((item) => item.apiAccessEnabled).length,
      monthlyRecurringRevenue: Number(
        tenants
          .filter((item) => item.status === "ACTIVE")
          .reduce((sum, item) => sum + item.subscriptionAmount, 0)
          .toFixed(2),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireTenant(id: string): SaasTenant {
    const tenant = this.tenants.get(id);
    if (!tenant) {
      throw new Error(`SaaS tenant not found: ${id}`);
    }
    return tenant;
  }
}