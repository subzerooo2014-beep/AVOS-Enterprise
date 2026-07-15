import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ENTERPRISE_ECOSYSTEM_HUBS } from "./enterprise-ecosystem.registry";
import {
  EcosystemExecutionRequest,
  EcosystemExecutionResult,
  EcosystemPartner,
} from "./enterprise-ecosystem.types";

@Injectable()
export class EnterpriseEcosystemService {
  private readonly partners = new Map<string, EcosystemPartner>();
  private readonly executions = new Map<string, EcosystemExecutionResult>();

  hubs() {
    return ENTERPRISE_ECOSYSTEM_HUBS.map((hub) => ({
      ...hub,
      capabilities: [...hub.capabilities],
      status: "READY",
    }));
  }

  hub(key: string) {
    const hub = ENTERPRISE_ECOSYSTEM_HUBS.find((item) => item.key === key);
    if (!hub) throw new Error(`Hub not found: ${key}`);

    return {
      ...hub,
      capabilities: [...hub.capabilities],
      status: "READY",
    };
  }

  registerPartner(
    input: Omit<EcosystemPartner, "id" | "active" | "createdAt">,
  ): EcosystemPartner {
    const hub = ENTERPRISE_ECOSYSTEM_HUBS.find(
      (item) => item.key === input.hub,
    );

    if (!hub) throw new Error(`Hub not found: ${input.hub}`);
    if (!input.name?.trim() || !input.country?.trim()) {
      throw new Error("Partner name and country are required");
    }

    const partner: EcosystemPartner = {
      ...input,
      id: randomUUID(),
      active: true,
      capabilities: [...input.capabilities],
      createdAt: new Date().toISOString(),
    };

    this.partners.set(partner.id, partner);
    return { ...partner, capabilities: [...partner.capabilities] };
  }

  partnersForHub(hub: string): EcosystemPartner[] {
    this.hub(hub);

    return Array.from(this.partners.values())
      .filter((partner) => partner.hub === hub)
      .map((partner) => ({
        ...partner,
        capabilities: [...partner.capabilities],
      }));
  }

  execute(
    hubKey: string,
    request: EcosystemExecutionRequest,
  ): EcosystemExecutionResult {
    const hub = ENTERPRISE_ECOSYSTEM_HUBS.find((item) => item.key === hubKey);

    if (!hub) throw new Error(`Hub not found: ${hubKey}`);
    if (!hub.capabilities.includes(request.capability)) {
      throw new Error(
        `Capability ${request.capability} is not supported by ${hubKey}`,
      );
    }

    const partner = this.partners.get(request.partnerId);

    if (!partner || !partner.active || partner.hub !== hubKey) {
      throw new Error("Active partner is required for this hub");
    }

    const execution: EcosystemExecutionResult = {
      id: randomUUID(),
      hub: hubKey,
      capability: request.capability,
      tenantId: request.tenantId,
      partnerId: request.partnerId,
      action: request.action,
      status: "COMPLETED",
      success: true,
      createdAt: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        partner: partner.name,
        governed: true,
        observable: true,
        auditable: true,
      },
    };

    this.executions.set(execution.id, execution);
    return { ...execution, output: { ...execution.output } };
  }

  health() {
    return {
      system: "AVOS Enterprise Ecosystem",
      status: "HEALTHY",
      hubs: ENTERPRISE_ECOSYSTEM_HUBS.length,
      partners: this.partners.size,
      executions: this.executions.size,
      generatedAt: new Date().toISOString(),
    };
  }
}