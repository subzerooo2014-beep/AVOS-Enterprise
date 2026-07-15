import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { INTELLIGENCE_CAPABILITIES } from "./global-intelligence-platform.registry";
import {
  IntelligenceCapability,
  IntelligenceDecision,
  IntelligenceFeedback,
  IntelligenceNode,
  IntelligenceScenario,
} from "./global-intelligence-platform.types";

@Injectable()
export class GlobalIntelligencePlatformService {
  private readonly nodes = new Map<string, IntelligenceNode>();
  private readonly decisions = new Map<string, IntelligenceDecision>();
  private readonly scenarios = new Map<string, IntelligenceScenario>();
  private readonly feedback = new Map<string, IntelligenceFeedback>();
  private readonly nodeCodeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Global Intelligence Platform — Enterprise Brain V2",
      status: "READY",
      capabilityCount: Object.keys(INTELLIGENCE_CAPABILITIES).length,
      capabilities: structuredClone(INTELLIGENCE_CAPABILITIES),
    };
  }

  registerNode(
    capability: IntelligenceCapability,
    input: Omit<
      IntelligenceNode,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (!INTELLIGENCE_CAPABILITIES[capability]) {
      throw new Error(`Unknown intelligence capability: ${capability}`);
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new Error("Node version must use semantic versioning");
    }

    const code = `${capability}:${input.code.trim().toUpperCase()}`;

    if (this.nodeCodeIndex.has(code)) {
      throw new Error(`Duplicate intelligence node code: ${code}`);
    }

    const now = new Date().toISOString();

    const node: IntelligenceNode = {
      ...input,
      id: randomUUID(),
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    if (!node.name || !node.owner) {
      throw new Error("Node name and owner are required");
    }

    this.nodes.set(node.id, node);
    this.nodeCodeIndex.set(code, node.id);

    return this.cloneNode(node);
  }

  activateNode(id: string) {
    const node = this.requireNode(id);
    node.status = "ACTIVE";
    node.updatedAt = new Date().toISOString();
    this.nodes.set(id, node);

    return this.cloneNode(node);
  }

  createDecision(
    input: Omit<
      IntelligenceDecision,
      "id" | "approvalStatus" | "executionStatus" | "createdAt" | "updatedAt"
    >,
  ) {
    if (input.confidence < 0 || input.confidence > 100) {
      throw new Error("Decision confidence must be between 0 and 100");
    }

    const now = new Date().toISOString();

    const decision: IntelligenceDecision = {
      ...input,
      id: randomUUID(),
      factors: [...input.factors],
      approvalStatus: input.requiresApproval ? "PENDING" : "NOT_REQUIRED",
      executionStatus: "NOT_STARTED",
      createdAt: now,
      updatedAt: now,
    };

    this.decisions.set(decision.id, decision);
    return this.cloneDecision(decision);
  }

  approveDecision(id: string, approved: boolean) {
    const decision = this.requireDecision(id);

    if (!decision.requiresApproval) {
      throw new Error("Decision does not require approval");
    }

    decision.approvalStatus = approved ? "APPROVED" : "REJECTED";
    decision.updatedAt = new Date().toISOString();
    this.decisions.set(id, decision);

    return this.cloneDecision(decision);
  }

  executeDecision(id: string) {
    const decision = this.requireDecision(id);

    if (
      decision.requiresApproval &&
      decision.approvalStatus !== "APPROVED"
    ) {
      throw new Error("Decision must be approved before execution");
    }

    decision.executionStatus = "COMPLETED";
    decision.updatedAt = new Date().toISOString();
    this.decisions.set(id, decision);

    return this.cloneDecision(decision);
  }

  simulateScenario(
    input: Omit<IntelligenceScenario, "id" | "createdAt">,
  ) {
    if (
      input.riskScore < 0 ||
      input.riskScore > 100 ||
      input.opportunityScore < 0 ||
      input.opportunityScore > 100
    ) {
      throw new Error("Scenario scores must be between 0 and 100");
    }

    const scenario: IntelligenceScenario = {
      ...input,
      id: randomUUID(),
      assumptions: { ...input.assumptions },
      projectedOutcomes: { ...input.projectedOutcomes },
      createdAt: new Date().toISOString(),
    };

    this.scenarios.set(scenario.id, scenario);
    return this.cloneScenario(scenario);
  }

  recordFeedback(
    decisionId: string,
    input: Omit<IntelligenceFeedback, "id" | "decisionId" | "createdAt">,
  ) {
    this.requireDecision(decisionId);

    if (input.score < 0 || input.score > 100) {
      throw new Error("Feedback score must be between 0 and 100");
    }

    const feedback: IntelligenceFeedback = {
      ...input,
      id: randomUUID(),
      decisionId,
      createdAt: new Date().toISOString(),
    };

    this.feedback.set(feedback.id, feedback);
    return { ...feedback };
  }

  listNodes(
    capability?: IntelligenceCapability,
    tenantId?: string,
  ) {
    return Array.from(this.nodes.values())
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneNode(item));
  }

  commandCenter() {
    const nodes = Array.from(this.nodes.values());
    const decisions = Array.from(this.decisions.values());
    const scenarios = Array.from(this.scenarios.values());
    const feedback = Array.from(this.feedback.values());

    return {
      system: "AVOS Global Intelligence Platform — Enterprise Brain V2",
      capabilities: Object.keys(INTELLIGENCE_CAPABILITIES).length,
      nodes: nodes.length,
      activeNodes: nodes.filter((item) => item.status === "ACTIVE").length,
      decisions: decisions.length,
      pendingApprovals: decisions.filter(
        (item) => item.approvalStatus === "PENDING",
      ).length,
      completedExecutions: decisions.filter(
        (item) => item.executionStatus === "COMPLETED",
      ).length,
      scenarios: scenarios.length,
      feedbackEntries: feedback.length,
      averageFeedbackScore:
        feedback.length === 0
          ? 0
          : Number(
              (
                feedback.reduce((sum, item) => sum + item.score, 0) /
                feedback.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireNode(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new Error(`Intelligence node not found: ${id}`);
    }

    return node;
  }

  private requireDecision(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new Error(`Intelligence decision not found: ${id}`);
    }

    return decision;
  }

  private cloneNode(node: IntelligenceNode): IntelligenceNode {
    return {
      ...node,
      metadata: { ...node.metadata },
    };
  }

  private cloneDecision(
    decision: IntelligenceDecision,
  ): IntelligenceDecision {
    return {
      ...decision,
      factors: [...decision.factors],
    };
  }

  private cloneScenario(
    scenario: IntelligenceScenario,
  ): IntelligenceScenario {
    return {
      ...scenario,
      assumptions: { ...scenario.assumptions },
      projectedOutcomes: { ...scenario.projectedOutcomes },
    };
  }
}