import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityTenantBinding } from "./capability-enterprise.types";

@Injectable()
export class CapabilityTenantService {
  private readonly bindings = new Map<string, CapabilityTenantBinding>();

  constructor(private readonly registry: CapabilityRegistryService) {}

  bind(input: {
    capabilityKey: string;
    tenantId: string;
    configuration?: Record<string, unknown>;
    policyOverrides?: string[];
    maxExecutionsPerHour?: number;
    maxConcurrentExecutions?: number;
  }) {
    const capability = this.registry.get(input.capabilityKey);
    if (!capability) {
      return { success: false, reason: "CAPABILITY_NOT_REGISTERED" };
    }

    if (!capability.runtime.multiTenant) {
      return { success: false, reason: "CAPABILITY_NOT_MULTI_TENANT" };
    }

    const id = `${input.tenantId}:${capability.identity.key}`;
    if (this.bindings.has(id)) {
      return { success: false, reason: "TENANT_BINDING_ALREADY_EXISTS" };
    }

    const now = new Date().toISOString();
    const binding: CapabilityTenantBinding = {
      id: randomUUID(),
      capabilityKey: capability.identity.key,
      tenantId: input.tenantId,
      enabled: true,
      configuration: structuredClone(input.configuration ?? {}),
      policyOverrides: [...(input.policyOverrides ?? [])],
      quota: {
        maxExecutionsPerHour: input.maxExecutionsPerHour ?? 10_000,
        maxConcurrentExecutions: input.maxConcurrentExecutions ?? 25,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.bindings.set(id, binding);
    return { success: true, binding: structuredClone(binding) };
  }

  setEnabled(capabilityKey: string, tenantId: string, enabled: boolean) {
    const binding = this.require(capabilityKey, tenantId);
    binding.enabled = enabled;
    binding.updatedAt = new Date().toISOString();
    return { success: true, binding: structuredClone(binding) };
  }

  get(capabilityKey: string, tenantId: string) {
    const binding = this.bindings.get(
      `${tenantId}:${capabilityKey.toLowerCase()}`,
    );
    return binding ? structuredClone(binding) : null;
  }

  list() {
    return [...this.bindings.values()].map((binding) =>
      structuredClone(binding),
    );
  }

  private require(capabilityKey: string, tenantId: string) {
    const binding = this.bindings.get(
      `${tenantId}:${capabilityKey.toLowerCase()}`,
    );
    if (!binding) {
      throw new Error(
        `Tenant capability binding not found: ${tenantId}/${capabilityKey}`,
      );
    }
    return binding;
  }
}