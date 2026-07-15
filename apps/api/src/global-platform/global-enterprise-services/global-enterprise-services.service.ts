import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  GlobalAccessContext,
  GlobalAccessResult,
  GlobalEnterpriseSnapshot,
  GlobalIdentityProvider,
  GlobalOrganizationNode,
  GlobalPolicy,
} from "./global-enterprise-services.types";

@Injectable()
export class GlobalEnterpriseServicesService {
  private readonly identityProviders =
    new Map<string, GlobalIdentityProvider>();
  private readonly organizationNodes =
    new Map<string, GlobalOrganizationNode>();
  private readonly policies = new Map<string, GlobalPolicy>();
  private readonly globalEvents: Array<Record<string, unknown>> = [];

  registerIdentityProvider(
    input: Omit<GlobalIdentityProvider, "id" | "createdAt" | "updatedAt">,
  ): GlobalIdentityProvider {
    const now = new Date().toISOString();
    const provider: GlobalIdentityProvider = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.identityProviders.set(provider.id, provider);
    this.publishEvent("GlobalIdentityProviderRegistered", {
      providerId: provider.id,
      tenantId: provider.tenantId,
      type: provider.type,
    });

    return { ...provider };
  }

  listIdentityProviders(): GlobalIdentityProvider[] {
    return Array.from(this.identityProviders.values()).map((item) => ({
      ...item,
    }));
  }

  createOrganizationNode(
    input: Omit<GlobalOrganizationNode, "id" | "createdAt" | "updatedAt">,
  ): GlobalOrganizationNode {
    const now = new Date().toISOString();
    const node: GlobalOrganizationNode = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.organizationNodes.set(node.id, node);
    this.publishEvent("GlobalOrganizationNodeCreated", {
      nodeId: node.id,
      tenantId: node.tenantId,
      type: node.type,
      countryCode: node.countryCode,
    });

    return { ...node };
  }

  listOrganizationNodes(): GlobalOrganizationNode[] {
    return Array.from(this.organizationNodes.values()).map((item) => ({
      ...item,
    }));
  }

  registerPolicy(
    input: Omit<GlobalPolicy, "id">,
  ): GlobalPolicy {
    const policy: GlobalPolicy = {
      ...input,
      id: randomUUID(),
      countries: [...new Set(input.countries.map((item) => item.toUpperCase()))],
      requiredRoles: [...new Set(input.requiredRoles)],
      requiredAttributes: { ...input.requiredAttributes },
    };

    this.policies.set(policy.id, policy);
    this.publishEvent("GlobalPolicyRegistered", {
      policyId: policy.id,
      tenantId: policy.tenantId,
      countries: policy.countries,
    });

    return this.clonePolicy(policy);
  }

  listPolicies(): GlobalPolicy[] {
    return Array.from(this.policies.values()).map((item) =>
      this.clonePolicy(item),
    );
  }

  evaluateAccess(context: GlobalAccessContext): GlobalAccessResult {
    const applicable = this.listPolicies().filter(
      (policy) =>
        policy.enabled &&
        policy.tenantId === context.tenantId &&
        (policy.countries.length === 0 ||
          !context.countryCode ||
          policy.countries.includes(context.countryCode.toUpperCase())),
    );

    const matchedRoles = new Set<string>();
    const matchedAttributes = new Set<string>();

    for (const policy of applicable) {
      const rolesMatch = policy.requiredRoles.every((role) => {
        const match = context.roles.includes(role);
        if (match) {
          matchedRoles.add(role);
        }
        return match;
      });

      const attributesMatch = Object.entries(
        policy.requiredAttributes,
      ).every(([key, value]) => {
        const match = context.attributes[key] === value;
        if (match) {
          matchedAttributes.add(key);
        }
        return match;
      });

      if (rolesMatch && attributesMatch) {
        return {
          decision: policy.effect,
          reason: `Matched global policy: ${policy.name}`,
          matchedRoles: Array.from(matchedRoles),
          matchedAttributes: Array.from(matchedAttributes),
          evaluatedAt: new Date().toISOString(),
        };
      }
    }

    return {
      decision: applicable.length > 0 ? "REVIEW" : "DENY",
      reason:
        applicable.length > 0
          ? "No global policy fully matched"
          : "No applicable global policy",
      matchedRoles: Array.from(matchedRoles),
      matchedAttributes: Array.from(matchedAttributes),
      evaluatedAt: new Date().toISOString(),
    };
  }

  publishEvent(
    eventType: string,
    payload: Record<string, unknown>,
  ) {
    const event = {
      id: randomUUID(),
      eventType,
      payload,
      regionAware: true,
      crossRegionReplication: true,
      occurredAt: new Date().toISOString(),
    };

    this.globalEvents.push(event);
    return { ...event };
  }

  listEvents() {
    return this.globalEvents.map((item) => ({ ...item }));
  }

  getExecutiveSnapshot(): GlobalEnterpriseSnapshot {
    const providers = this.listIdentityProviders();
    const nodes = this.listOrganizationNodes();
    const policies = this.listPolicies();
    const enabledPolicies = policies.filter((item) => item.enabled).length;
    const governanceScore =
      policies.length === 0
        ? 100
        : Math.round((enabledPolicies / policies.length) * 100);

    return {
      system: "AVOS Global Platform",
      component: "Global Enterprise Services",
      identityProviders: providers.length,
      organizationNodes: nodes.length,
      policies: policies.length,
      enabledPolicies,
      globalEvents: this.globalEvents.length,
      governanceScore,
      status: governanceScore >= 80 ? "HEALTHY" : "DEGRADED",
      generatedAt: new Date().toISOString(),
    };
  }

  private clonePolicy(policy: GlobalPolicy): GlobalPolicy {
    return {
      ...policy,
      countries: [...policy.countries],
      requiredRoles: [...policy.requiredRoles],
      requiredAttributes: { ...policy.requiredAttributes },
    };
  }
}