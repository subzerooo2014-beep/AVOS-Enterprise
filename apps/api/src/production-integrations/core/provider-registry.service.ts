import { Injectable, NotFoundException } from "@nestjs/common";
import { ProviderConfig, ProviderKind } from "../production-integrations.types";

@Injectable()
export class ProviderRegistryService {
  private readonly providers: ProviderConfig[] = [
    { code: "BANK_SANDBOX_1", kind: "BANK", baseUrl: "https://sandbox.local/bank", timeoutMs: 8000, retryLimit: 3, priority: 1, enabled: true },
    { code: "PAYMENT_SANDBOX_1", kind: "PAYMENT", baseUrl: "https://sandbox.local/payment", timeoutMs: 6000, retryLimit: 3, priority: 1, enabled: true },
    { code: "INSURANCE_SANDBOX_1", kind: "INSURANCE", baseUrl: "https://sandbox.local/insurance", timeoutMs: 8000, retryLimit: 3, priority: 1, enabled: true },
    { code: "INSPECTION_SANDBOX_1", kind: "INSPECTION", baseUrl: "https://sandbox.local/inspection", timeoutMs: 10000, retryLimit: 2, priority: 1, enabled: true },
    { code: "GOV_SANDBOX_1", kind: "GOVERNMENT", baseUrl: "https://sandbox.local/government", timeoutMs: 12000, retryLimit: 2, priority: 1, enabled: true },
    { code: "SHIPPING_SANDBOX_1", kind: "SHIPPING", baseUrl: "https://sandbox.local/shipping", timeoutMs: 10000, retryLimit: 3, priority: 1, enabled: true },
    { code: "EXPORT_SANDBOX_1", kind: "EXPORT", baseUrl: "https://sandbox.local/export", timeoutMs: 12000, retryLimit: 2, priority: 1, enabled: true },
  ];

  list(): ProviderConfig[] { return [...this.providers]; }

  byKind(kind: ProviderKind): ProviderConfig[] {
    return this.providers.filter((p) => p.kind === kind && p.enabled).sort((a,b) => a.priority - b.priority);
  }

  get(code: string): ProviderConfig {
    const provider = this.providers.find((p) => p.code === code);
    if (!provider) throw new NotFoundException(`Provider ${code} not found`);
    return provider;
  }
}
