import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationIntegrationV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationIntegrationsV1Service {
  private readonly integrations = new Map<string, FoundationIntegrationV1>();

  upsert(
    input: Omit<FoundationIntegrationV1, "createdAt" | "updatedAt">,
  ): FoundationIntegrationV1 {
    const existing = this.integrations.get(input.id);
    const now = new Date().toISOString();

    const integration: FoundationIntegrationV1 = {
      ...input,
      metadata: { ...input.metadata },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.integrations.set(integration.id, integration);
    return this.clone(integration);
  }

  get(id: string): FoundationIntegrationV1 {
    const integration = this.integrations.get(id);

    if (!integration) {
      throw new NotFoundException(`Integration '${id}' was not found.`);
    }

    return this.clone(integration);
  }

  list(): FoundationIntegrationV1[] {
    return Array.from(this.integrations.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.integrations.size;
  }

  private clone(item: FoundationIntegrationV1): FoundationIntegrationV1 {
    return { ...item, metadata: { ...item.metadata } };
  }
}
