import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AUTONOMOUS_ENTERPRISE_DOMAINS } from "./autonomous-enterprise-os.registry";
import {
  AutonomousCapability,
  AutonomousDecision,
  AutonomousEconomyItem,
  AutonomousEnterpriseDomain,
  AutonomousMission,
  AutonomousPolicy,
} from "./autonomous-enterprise-os.types";

@Injectable()
export class AutonomousEnterpriseOsService {
  private readonly capabilities = new Map<string, AutonomousCapability>();
  private readonly missions = new Map<string, AutonomousMission>();
  private readonly decisions = new Map<string, AutonomousDecision>();
  private readonly policies = new Map<string, AutonomousPolicy>();
  private readonly economy = new Map<string, AutonomousEconomyItem>();
  private readonly codes = new Set<string>();

  framework() {
    return {
      system: "AVOS Autonomous Enterprise OS Ultimate V1",
      status: "READY",
      domains: structuredClone(AUTONOMOUS_ENTERPRISE_DOMAINS),
      domainCount: Object.keys(AUTONOMOUS_ENTERPRISE_DOMAINS).length,
      capabilityCount: Object.values(AUTONOMOUS_ENTERPRISE_DOMAINS).reduce(
        (sum, domain) => sum + domain.capabilities.length,
        0,
      ),
    };
  }

  registerCapability(
    domain: AutonomousEnterpriseDomain,
    input: Omit<
      AutonomousCapability,
      "id" | "domain" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const registry = AUTONOMOUS_ENTERPRISE_DOMAINS[domain];

    if (!registry) {
      throw new Error(`Unknown domain: ${domain}`);
    }

    if (!registry.capabilities.includes(input.code)) {
      throw new Error(`Capability ${input.code} is not enabled for ${domain}`);
    }

    const key = `${domain}:${input.code}:${input.version}`;

    if (this.codes.has(key)) {
      throw new Error(`Duplicate capability version: ${key}`);
    }

    const now = new Date().toISOString();

    const capability: AutonomousCapability = {
      ...input,
      id: randomUUID(),
      domain,
      status: "REGISTERED",
      configuration: { ...input.configuration },
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

  createMission(
    capabilityId: string,
    input: Omit<
      AutonomousMission,
      "id" | "capabilityId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const capability = this.requireCapability(capabilityId);

    if (capability.status !== "ACTIVE") {
      throw new Error("Capability must be active before creating a mission");
    }

    const now = new Date().toISOString();

    const mission: AutonomousMission = {
      ...input,
      id: randomUUID(),
      capabilityId,
      status: "PLANNED",
      steps: [...input.steps],
      evidence: [...input.evidence],
      createdAt: now,
      updatedAt: now,
    };

    this.missions.set(mission.id, mission);
    return this.cloneMission(mission);
  }

  startMission(id: string) {
    const mission = this.requireMission(id);
    mission.status = "RUNNING";
    mission.startedAt = new Date().toISOString();
    mission.updatedAt = mission.startedAt;
    this.missions.set(id, mission);

    return this.cloneMission(mission);
  }

  completeMission(id: string, evidence: string) {
    const mission = this.requireMission(id);

    if (mission.status !== "RUNNING") {
      throw new Error("Mission must be running before completion");
    }

    mission.status = "COMPLETED";
    mission.evidence.push(evidence);
    mission.completedAt = new Date().toISOString();
    mission.updatedAt = mission.completedAt;
    this.missions.set(id, mission);

    return this.cloneMission(mission);
  }

  createDecision(
    missionId: string,
    input: Omit<
      AutonomousDecision,
      "id" | "missionId" | "approved" | "executed" | "createdAt" | "updatedAt"
    >,
  ) {
    this.requireMission(missionId);

    if (input.confidence < 0 || input.confidence > 100) {
      throw new Error("Decision confidence must be between 0 and 100");
    }

    const now = new Date().toISOString();

    const decision: AutonomousDecision = {
      ...input,
      id: randomUUID(),
      missionId,
      approved: false,
      executed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.decisions.set(decision.id, decision);
    return { ...decision };
  }

  approveDecision(id: string) {
    const decision = this.requireDecision(id);
    decision.approved = true;
    decision.updatedAt = new Date().toISOString();
    this.decisions.set(id, decision);

    return { ...decision };
  }

  executeDecision(id: string) {
    const decision = this.requireDecision(id);

    if (!decision.approved) {
      throw new Error("Decision must be approved before execution");
    }

    decision.executed = true;
    decision.updatedAt = new Date().toISOString();
    this.decisions.set(id, decision);

    return { ...decision };
  }

  registerPolicy(
    input: Omit<AutonomousPolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();

    const policy: AutonomousPolicy = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.policies.set(policy.id, policy);
    return { ...policy };
  }

  publishEconomyItem(
    input: Omit<
      AutonomousEconomyItem,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (input.price < 0) {
      throw new Error("Price cannot be negative");
    }

    const now = new Date().toISOString();

    const item: AutonomousEconomyItem = {
      ...input,
      id: randomUUID(),
      status: "PUBLISHED",
      createdAt: now,
      updatedAt: now,
    };

    this.economy.set(item.id, item);
    return { ...item };
  }

  listCapabilities(domain?: AutonomousEnterpriseDomain) {
    return Array.from(this.capabilities.values())
      .filter((item) => !domain || item.domain === domain)
      .map((item) => this.cloneCapability(item));
  }

  commandCenter() {
    const capabilities = Array.from(this.capabilities.values());
    const missions = Array.from(this.missions.values());
    const decisions = Array.from(this.decisions.values());
    const policies = Array.from(this.policies.values());
    const economy = Array.from(this.economy.values());

    return {
      system: "AVOS Autonomous Enterprise OS Ultimate V1",
      registeredCapabilities: capabilities.length,
      activeCapabilities: capabilities.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      missions: missions.length,
      runningMissions: missions.filter((item) => item.status === "RUNNING")
        .length,
      completedMissions: missions.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      decisions: decisions.length,
      approvedDecisions: decisions.filter((item) => item.approved).length,
      executedDecisions: decisions.filter((item) => item.executed).length,
      enabledPolicies: policies.filter((item) => item.enabled).length,
      economyItems: economy.length,
      publishedEconomyItems: economy.filter(
        (item) => item.status === "PUBLISHED",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireCapability(id: string) {
    const item = this.capabilities.get(id);
    if (!item) {
      throw new Error(`Capability not found: ${id}`);
    }
    return item;
  }

  private requireMission(id: string) {
    const item = this.missions.get(id);
    if (!item) {
      throw new Error(`Mission not found: ${id}`);
    }
    return item;
  }

  private requireDecision(id: string) {
    const item = this.decisions.get(id);
    if (!item) {
      throw new Error(`Decision not found: ${id}`);
    }
    return item;
  }

  private cloneCapability(
    item: AutonomousCapability,
  ): AutonomousCapability {
    return {
      ...item,
      configuration: { ...item.configuration },
    };
  }

  private cloneMission(item: AutonomousMission): AutonomousMission {
    return {
      ...item,
      steps: [...item.steps],
      evidence: [...item.evidence],
    };
  }
}