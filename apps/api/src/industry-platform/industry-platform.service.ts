import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  IndustryCapabilityBinding,
  IndustryDefinition,
  IndustryOperationRequest,
  IndustryOperationResult,
  SharedCapabilityDefinition,
} from "./industry-platform.types";
import {
  DEFAULT_INDUSTRIES,
  DEFAULT_SHARED_CAPABILITIES,
} from "./industry-platform.registry";

@Injectable()
export class IndustryPlatformService {
  private readonly industries = new Map<string, IndustryDefinition>();
  private readonly capabilities =
    new Map<string, SharedCapabilityDefinition>();
  private readonly bindings = new Map<string, IndustryCapabilityBinding>();
  private readonly operations = new Map<string, IndustryOperationResult>();

  constructor() {
    this.seedDefaults();
  }

  listIndustries(): IndustryDefinition[] {
    return Array.from(this.industries.values()).map((industry) =>
      this.cloneIndustry(industry),
    );
  }

  industry(key: string): IndustryDefinition {
    return this.cloneIndustry(this.requireIndustry(key));
  }

  listCapabilities(): SharedCapabilityDefinition[] {
    return Array.from(this.capabilities.values()).map((capability) =>
      this.cloneCapability(capability),
    );
  }

  registerIndustry(
    input: Omit<IndustryDefinition, "createdAt" | "updatedAt">,
  ): IndustryDefinition {
    const now = new Date().toISOString();
    const industry: IndustryDefinition = {
      ...input,
      sharedCapabilities: [...input.sharedCapabilities],
      specializedCapabilities: [...input.specializedCapabilities],
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.industries.set(industry.key, industry);
    return this.cloneIndustry(industry);
  }

  registerCapability(
    input: Omit<SharedCapabilityDefinition, "createdAt" | "updatedAt">,
  ): SharedCapabilityDefinition {
    const now = new Date().toISOString();
    const capability: SharedCapabilityDefinition = {
      ...input,
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.capabilities.set(capability.key, capability);
    return this.cloneCapability(capability);
  }

  bindCapability(
    industryKey: string,
    capabilityKey: string,
    configuration: Record<string, unknown>,
  ): IndustryCapabilityBinding {
    this.requireIndustry(industryKey);
    this.requireCapability(capabilityKey);

    const bindingKey = `${industryKey}:${capabilityKey}`;
    const existing = this.bindings.get(bindingKey);
    const now = new Date().toISOString();

    const binding: IndustryCapabilityBinding = {
      id: existing?.id ?? randomUUID(),
      industryKey,
      capabilityKey,
      enabled: true,
      configuration: { ...configuration },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.bindings.set(bindingKey, binding);
    return this.cloneBinding(binding);
  }

  bindingsForIndustry(industryKey: string): IndustryCapabilityBinding[] {
    this.requireIndustry(industryKey);

    return Array.from(this.bindings.values())
      .filter((binding) => binding.industryKey === industryKey)
      .map((binding) => this.cloneBinding(binding));
  }

  execute(
    request: IndustryOperationRequest,
  ): IndustryOperationResult {
    this.requireIndustry(request.industryKey);
    this.requireCapability(request.capabilityKey);

    const binding = this.bindings.get(
      `${request.industryKey}:${request.capabilityKey}`,
    );

    if (!binding || !binding.enabled) {
      throw new Error(
        `Capability ${request.capabilityKey} is not enabled for ${request.industryKey}`,
      );
    }

    if (
      !request.tenantId?.trim() ||
      !request.actorId?.trim() ||
      !request.action?.trim()
    ) {
      throw new Error("tenantId, actorId and action are required");
    }

    const result: IndustryOperationResult = {
      id: randomUUID(),
      industryKey: request.industryKey,
      capabilityKey: request.capabilityKey,
      tenantId: request.tenantId,
      actorId: request.actorId,
      action: request.action,
      success: true,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        configuration: { ...binding.configuration },
        sharedCapability: true,
        industryBasedArchitecture: true,
        governed: true,
        auditable: true,
      },
    };

    this.operations.set(result.id, result);
    return {
      ...result,
      output: { ...result.output },
    };
  }

  dashboard() {
    return {
      system: "AVOS Industry Platform Foundation",
      architecture: "INDUSTRY_BASED",
      industries: this.industries.size,
      sharedCapabilities: this.capabilities.size,
      bindings: this.bindings.size,
      operations: this.operations.size,
      reusableCapabilities: Array.from(this.capabilities.values()).filter(
        (capability) => capability.reusable,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private seedDefaults() {
    const now = new Date().toISOString();

    for (const key of DEFAULT_INDUSTRIES) {
      this.industries.set(key, {
        key,
        name: key
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        status: "ACTIVE",
        sharedCapabilities: [...DEFAULT_SHARED_CAPABILITIES],
        specializedCapabilities: [],
        metadata: {
          seeded: true,
          architecture: "INDUSTRY_BASED",
        },
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const key of DEFAULT_SHARED_CAPABILITIES) {
      const domainMap: Record<string, SharedCapabilityDefinition["domain"]> = {
        sales: "COMMERCE",
        rentals: "RENTAL",
        maintenance: "MAINTENANCE",
        parts: "PARTS",
        accessories: "PARTS",
        finance: "FINANCE",
        insurance: "INSURANCE",
        logistics: "LOGISTICS",
        inspections: "INSPECTION",
        dealerships: "DEALERSHIP",
        marketplaces: "MARKETPLACE",
      };

      this.capabilities.set(key, {
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        domain: domainMap[key],
        reusable: true,
        version: "1.0.0",
        status: "ACTIVE",
        metadata: {
          seeded: true,
          sharedAcrossIndustries: true,
        },
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const industryKey of DEFAULT_INDUSTRIES) {
      for (const capabilityKey of DEFAULT_SHARED_CAPABILITIES) {
        const bindingKey = `${industryKey}:${capabilityKey}`;

        this.bindings.set(bindingKey, {
          id: randomUUID(),
          industryKey,
          capabilityKey,
          enabled: true,
          configuration: {
            inherited: true,
            source: "shared-capability-foundation",
          },
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  private requireIndustry(key: string): IndustryDefinition {
    const industry = this.industries.get(key);

    if (!industry || industry.status !== "ACTIVE") {
      throw new Error(`Active industry not found: ${key}`);
    }

    return industry;
  }

  private requireCapability(key: string): SharedCapabilityDefinition {
    const capability = this.capabilities.get(key);

    if (!capability || capability.status !== "ACTIVE") {
      throw new Error(`Active capability not found: ${key}`);
    }

    return capability;
  }

  private cloneIndustry(industry: IndustryDefinition): IndustryDefinition {
    return {
      ...industry,
      sharedCapabilities: [...industry.sharedCapabilities],
      specializedCapabilities: [...industry.specializedCapabilities],
      metadata: { ...industry.metadata },
    };
  }

  private cloneCapability(
    capability: SharedCapabilityDefinition,
  ): SharedCapabilityDefinition {
    return {
      ...capability,
      metadata: { ...capability.metadata },
    };
  }

  private cloneBinding(
    binding: IndustryCapabilityBinding,
  ): IndustryCapabilityBinding {
    return {
      ...binding,
      configuration: { ...binding.configuration },
    };
  }
}