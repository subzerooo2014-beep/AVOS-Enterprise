import { Injectable, NotFoundException } from "@nestjs/common";
import {
  PartnerCategory,
  PartnerConfiguration,
  PartnerEnvironment,
} from "./partner-platform.types";

@Injectable()
export class PartnerRegistryService {
  private readonly partners = new Map<string, PartnerConfiguration>();

  constructor() {
    const defaults: Array<{
      code: string;
      name: string;
      category: PartnerCategory;
    }> = [
      { code: "AVOS_FINANCE_UAE", name: "AVOS Finance UAE", category: "FINANCE" },
      { code: "AVOS_INSURANCE_UAE", name: "AVOS Insurance UAE", category: "INSURANCE" },
      { code: "AVOS_INSPECTION_UAE", name: "AVOS Inspection UAE", category: "INSPECTION" },
      { code: "AVOS_PAYMENT_UAE", name: "AVOS Payment UAE", category: "PAYMENT" },
      { code: "AVOS_SHIPPING_UAE", name: "AVOS Shipping UAE", category: "SHIPPING" },
      { code: "AVOS_EXPORT_UAE", name: "AVOS Export UAE", category: "EXPORT" },
    ];

    for (const item of defaults) {
      const now = new Date().toISOString();
      this.partners.set(item.code, {
        id: `partner_${item.code.toLowerCase()}`,
        code: item.code,
        name: item.name,
        category: item.category,
        environment: "SANDBOX",
        baseUrl: `https://sandbox.local/${item.category.toLowerCase()}`,
        authType: "API_KEY",
        apiKeyHeader: "x-api-key",
        secretMasked: "********",
        webhookSecretMasked: "********",
        timeoutMs: 10000,
        retryLimit: 3,
        enabled: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  list(): PartnerConfiguration[] {
    return [...this.partners.values()];
  }

  get(code: string): PartnerConfiguration {
    const partner = this.partners.get(code);
    if (!partner) throw new NotFoundException(`Partner ${code} not found`);
    return partner;
  }

  findByCategory(category: PartnerCategory): PartnerConfiguration {
    const partner = this.list().find(
      (item) => item.category === category && item.enabled,
    );
    if (!partner) throw new NotFoundException(`No partner for ${category}`);
    return partner;
  }

  switchEnvironment(
    code: string,
    environment: PartnerEnvironment,
  ): PartnerConfiguration {
    const partner = this.get(code);
    partner.environment = environment;
    partner.baseUrl =
      environment === "SANDBOX"
        ? `https://sandbox.local/${partner.category.toLowerCase()}`
        : `https://production.local/${partner.category.toLowerCase()}`;
    partner.updatedAt = new Date().toISOString();
    return partner;
  }

  updateCredentials(
    code: string,
    input: {
      clientId?: string;
      secret?: string;
      tokenUrl?: string;
      webhookSecret?: string;
    },
  ): PartnerConfiguration {
    const partner = this.get(code);
    if (input.clientId) partner.clientId = input.clientId;
    if (input.secret) partner.secretMasked = this.mask(input.secret);
    if (input.tokenUrl) partner.tokenUrl = input.tokenUrl;
    if (input.webhookSecret) {
      partner.webhookSecretMasked = this.mask(input.webhookSecret);
    }
    partner.updatedAt = new Date().toISOString();
    return partner;
  }

  private mask(value: string): string {
    if (value.length <= 4) return "****";
    return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
  }
}
