import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ENTERPRISE_PLATFORM_DOMAINS } from "./enterprise-platform-ultimate.registry";
import {
  EnterpriseCapability,
  EnterpriseDomain,
  EnterpriseExecution,
  EnterpriseMarketplaceItem,
  EnterprisePolicy,
} from "./enterprise-platform-ultimate.types";

@Injectable()
export class EnterprisePlatformUltimateService {
  private readonly capabilities = new Map<string, EnterpriseCapability>();
  private readonly executions = new Map<string, EnterpriseExecution>();
  private readonly policies = new Map<string, EnterprisePolicy>();
  private readonly marketplace = new Map<string, EnterpriseMarketplaceItem>();
  private readonly codes = new Set<string>();

  framework() {
    return {
      system: "AVOS Enterprise Platform Ultimate Bundle V1",
      status: "READY",
      domains: structuredClone(ENTERPRISE_PLATFORM_DOMAINS),
      domainCount: Object.keys(ENTERPRISE_PLATFORM_DOMAINS).length,
      totalCapabilities: Object.values(ENTERPRISE_PLATFORM_DOMAINS).reduce(
        (sum, item) => sum + item.capabilities.length,
        0,
      ),
    };
  }

  registerCapability(
    domain: EnterpriseDomain,
    input: Omit<
      EnterpriseCapability,
      "id" | "domain" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const config = ENTERPRISE_PLATFORM_DOMAINS[domain];

    if (!config) throw new Error(`Unknown domain: ${domain}`);

    if (!config.capabilities.includes(input.code)) {
      throw new Error(`Capability ${input.code} is not registered for ${domain}`);
    }

    const key = `${domain}:${input.code}:${input.version}`;

    if (this.codes.has(key)) {
      throw new Error(`Duplicate capability version: ${key}`);
    }

    const now = new Date().toISOString();

    const capability: EnterpriseCapability = {
      ...input,
      id: randomUUID(),
      domain,
      status: "REGISTERED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.capabilities.set(capability.id, capability);
    this.codes.add(key);

    return this.cloneCapability(capability);
  }

  activateCapability(id: string) {
    const capability = this.requireCapability(id);
    capability.status = "ACTIVE";
    capability.updatedAt = new Date().toISOString();
    this.capabilities.set(id, capability);
    return this.cloneCapability(capability);
  }

  execute(
    capabilityId: string,
    action: string,
    payload: Record<string, unknown>,
  ) {
    const capability = this.requireCapability(capabilityId);

    if (capability.status !== "ACTIVE") {
      throw new Error("Capability must be active before execution");
    }

    const now = new Date().toISOString();

    const execution: EnterpriseExecution = {
      id: randomUUID(),
      capabilityId,
      action,
      payload: { ...payload },
      status: "COMPLETED",
      result: {
        accepted: true,
        domain: capability.domain,
        capability: capability.code,
        action,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.executions.set(execution.id, execution);
    return this.cloneExecution(execution);
  }

  registerPolicy(
    input: Omit<EnterprisePolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();

    const policy: EnterprisePolicy = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.policies.set(policy.id, policy);
    return { ...policy };
  }

  publishMarketplaceItem(
    input: Omit<
      EnterpriseMarketplaceItem,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (input.price < 0) throw new Error("Price cannot be negative");

    const now = new Date().toISOString();

    const item: EnterpriseMarketplaceItem = {
      ...input,
      id: randomUUID(),
      status: "PUBLISHED",
      createdAt: now,
      updatedAt: now,
    };

    this.marketplace.set(item.id, item);
    return { ...item };
  }

  listCapabilities(domain?: EnterpriseDomain) {
    return Array.from(this.capabilities.values())
      .filter((item) => !domain || item.domain === domain)
      .map((item) => this.cloneCapability(item));
  }

  commandCenter() {
    const capabilities = Array.from(this.capabilities.values());
    const executions = Array.from(this.executions.values());
    const policies = Array.from(this.policies.values());
    const marketplace = Array.from(this.marketplace.values());

    return {
      system: "AVOS Enterprise Platform Ultimate Bundle V1",
      domains: Object.keys(ENTERPRISE_PLATFORM_DOMAINS).length,
      registeredCapabilities: capabilities.length,
      activeCapabilities: capabilities.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      executions: executions.length,
      completedExecutions: executions.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      enabledPolicies: policies.filter((item) => item.enabled).length,
      marketplaceItems: marketplace.length,
      publishedMarketplaceItems: marketplace.filter(
        (item) => item.status === "PUBLISHED",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireCapability(id: string) {
    const item = this.capabilities.get(id);
    if (!item) throw new Error(`Capability not found: ${id}`);
    return item;
  }

  private cloneCapability(
    item: EnterpriseCapability,
  ): EnterpriseCapability {
    return {
      ...item,
      metadata: { ...item.metadata },
    };
  }

  private cloneExecution(item: EnterpriseExecution): EnterpriseExecution {
    return {
      ...item,
      payload: { ...item.payload },
      result: item.result ? { ...item.result } : undefined,
    };
  }
}