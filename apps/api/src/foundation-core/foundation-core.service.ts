import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CapabilityRegistryEntry,
  FoundationAuditRecord,
  FoundationDecisionRequest,
  FoundationDecisionResult,
  FoundationEventRecord,
  IndustryRegistryEntry,
  LeadDealRecord,
  PlatformRegistryEntry,
} from "./foundation-core.types";
import {
  DEFAULT_SHARED_CAPABILITIES,
  FOUNDATION_COMPONENTS,
} from "./foundation-core.registry";

@Injectable()
export class FoundationCoreService {
  private readonly platforms = new Map<string, PlatformRegistryEntry>();
  private readonly industries = new Map<string, IndustryRegistryEntry>();
  private readonly capabilities = new Map<string, CapabilityRegistryEntry>();
  private readonly leadDeals = new Map<string, LeadDealRecord>();
  private readonly audits = new Map<string, FoundationAuditRecord>();
  private readonly events = new Map<string, FoundationEventRecord>();
  private readonly decisions = new Map<string, FoundationDecisionResult>();

  components() {
    return {
      architecture: "INDUSTRY_BASED",
      components: [...FOUNDATION_COMPONENTS],
      sharedCapabilities: [...DEFAULT_SHARED_CAPABILITIES],
      status: "READY",
    };
  }

  registerPlatform(
    input: Omit<PlatformRegistryEntry, "createdAt" | "updatedAt">,
  ): PlatformRegistryEntry {
    const now = new Date().toISOString();
    const entry: PlatformRegistryEntry = {
      ...input,
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.platforms.set(entry.key, entry);
    return this.clonePlatform(entry);
  }

  registerIndustry(
    input: Omit<IndustryRegistryEntry, "createdAt" | "updatedAt">,
  ): IndustryRegistryEntry {
    const now = new Date().toISOString();
    const entry: IndustryRegistryEntry = {
      ...input,
      sharedCapabilities: [...input.sharedCapabilities],
      createdAt: now,
      updatedAt: now,
    };

    this.industries.set(entry.key, entry);
    return this.cloneIndustry(entry);
  }

  registerCapability(
    input: Omit<CapabilityRegistryEntry, "createdAt" | "updatedAt">,
  ): CapabilityRegistryEntry {
    const now = new Date().toISOString();
    const entry: CapabilityRegistryEntry = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.capabilities.set(entry.key, entry);
    return { ...entry };
  }

  createLeadDeal(
    input: Omit<LeadDealRecord, "id" | "createdAt" | "updatedAt">,
  ): LeadDealRecord {
    const now = new Date().toISOString();
    const record: LeadDealRecord = {
      ...input,
      id: randomUUID(),
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.leadDeals.set(record.id, record);
    return this.cloneLeadDeal(record);
  }

  advanceLeadDeal(
    id: string,
    stage: LeadDealRecord["stage"],
  ): LeadDealRecord {
    const record = this.requireLeadDeal(id);
    record.stage = stage;
    record.updatedAt = new Date().toISOString();
    this.leadDeals.set(id, record);
    return this.cloneLeadDeal(record);
  }

  trackAudit(
    input: Omit<FoundationAuditRecord, "id" | "createdAt">,
  ): FoundationAuditRecord {
    const record: FoundationAuditRecord = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      createdAt: new Date().toISOString(),
    };

    this.audits.set(record.id, record);
    return { ...record, payload: { ...record.payload } };
  }

  trackEvent(
    input: Omit<FoundationEventRecord, "id" | "createdAt">,
  ): FoundationEventRecord {
    const record: FoundationEventRecord = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      createdAt: new Date().toISOString(),
    };

    this.events.set(record.id, record);
    return { ...record, payload: { ...record.payload } };
  }

  ownerDecision(
    input: FoundationDecisionRequest,
  ): FoundationDecisionResult {
    const result: FoundationDecisionResult = {
      id: randomUUID(),
      tenantId: input.tenantId,
      actorId: input.actorId,
      industry: input.industry,
      capability: input.capability,
      objective: input.objective,
      recommendation:
        "Proceed through governed executive review with revenue, risk, and audit traceability.",
      confidence: 85,
      requiresOwnerApproval: true,
      createdAt: new Date().toISOString(),
    };

    this.decisions.set(result.id, result);
    return { ...result };
  }

  dashboard() {
    return {
      system: "AVOS Foundation Core Architecture",
      architecture: "INDUSTRY_BASED",
      platforms: this.platforms.size,
      industries: this.industries.size,
      capabilities: this.capabilities.size,
      leadDeals: this.leadDeals.size,
      audits: this.audits.size,
      events: this.events.size,
      ownerDecisions: this.decisions.size,
      revenueProtection: true,
      governanceEnabled: true,
      constitutionEnabled: true,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireLeadDeal(id: string): LeadDealRecord {
    const record = this.leadDeals.get(id);

    if (!record) {
      throw new Error(`Lead deal not found: ${id}`);
    }

    return record;
  }

  private clonePlatform(
    entry: PlatformRegistryEntry,
  ): PlatformRegistryEntry {
    return {
      ...entry,
      metadata: { ...entry.metadata },
    };
  }

  private cloneIndustry(
    entry: IndustryRegistryEntry,
  ): IndustryRegistryEntry {
    return {
      ...entry,
      sharedCapabilities: [...entry.sharedCapabilities],
    };
  }

  private cloneLeadDeal(record: LeadDealRecord): LeadDealRecord {
    return {
      ...record,
      metadata: { ...record.metadata },
    };
  }
}