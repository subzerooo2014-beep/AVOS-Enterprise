import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CrmCustomer360 } from "./enterprise-product-suites.types";

@Injectable()
export class EnterpriseCrmSuiteService {
  private readonly customers = new Map<string, CrmCustomer360>();

  upsert(
    input: Omit<CrmCustomer360, "id" | "createdAt" | "updatedAt"> & { id?: string },
  ): CrmCustomer360 {
    if (input.trustScore < 0 || input.trustScore > 100) {
      throw new Error("trustScore must be between 0 and 100");
    }

    const now = new Date().toISOString();
    const existing = input.id ? this.customers.get(input.id) : undefined;

    const customer: CrmCustomer360 = {
      id: input.id ?? randomUUID(),
      tenantId: input.tenantId,
      customerId: input.customerId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      lifecycleStage: input.lifecycleStage,
      trustScore: input.trustScore,
      loyaltyPoints: input.loyaltyPoints,
      preferences: { ...input.preferences },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.customers.set(customer.id, customer);
    return this.clone(customer);
  }

  addLoyaltyPoints(id: string, points: number): CrmCustomer360 {
    const customer = this.requireCustomer(id);

    if (points <= 0) {
      throw new Error("points must be positive");
    }

    customer.loyaltyPoints += points;
    customer.lifecycleStage =
      customer.loyaltyPoints >= 1000 ? "LOYAL" : customer.lifecycleStage;
    customer.updatedAt = new Date().toISOString();

    this.customers.set(id, customer);
    return this.clone(customer);
  }

  dashboard() {
    const customers = Array.from(this.customers.values());

    return {
      customers: customers.length,
      leads: customers.filter((item) => item.lifecycleStage === "LEAD").length,
      activeCustomers: customers.filter((item) =>
        ["CUSTOMER", "LOYAL"].includes(item.lifecycleStage),
      ).length,
      loyalCustomers: customers.filter((item) => item.lifecycleStage === "LOYAL").length,
      averageTrust:
        customers.length === 0
          ? 0
          : Number(
              (
                customers.reduce((sum, item) => sum + item.trustScore, 0) /
                customers.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireCustomer(id: string): CrmCustomer360 {
    const customer = this.customers.get(id);
    if (!customer) {
      throw new Error(`CRM customer not found: ${id}`);
    }
    return customer;
  }

  private clone(customer: CrmCustomer360): CrmCustomer360 {
    return {
      ...customer,
      preferences: { ...customer.preferences },
    };
  }
}