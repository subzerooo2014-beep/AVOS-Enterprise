import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CreateEnterpriseDecisionDto, EvaluateDecisionDto, SelectDecisionOptionDto } from "../dto/enterprise-decision-intelligence.dto";
import { DecisionRiskLevel, DecisionTrace, EnterpriseDecisionRecord } from "../contracts/enterprise-decision-intelligence.contracts";
import { EnterpriseDecisionPolicyService } from "./enterprise-decision-policy.service";
import { EnterpriseDecisionRuleService } from "./enterprise-decision-rule.service";
import { EnterpriseDecisionSimulationService } from "./enterprise-decision-simulation.service";
import { EnterpriseDecisionRecommendationService } from "./enterprise-decision-recommendation.service";
import { EnterpriseDecisionMemoryService } from "./enterprise-decision-memory.service";

@Injectable()
export class EnterpriseDecisionIntelligenceService {
  constructor(
    private readonly policyService: EnterpriseDecisionPolicyService,
    private readonly ruleService: EnterpriseDecisionRuleService,
    private readonly simulationService: EnterpriseDecisionSimulationService,
    private readonly recommendationService: EnterpriseDecisionRecommendationService,
    private readonly memoryService: EnterpriseDecisionMemoryService
  ) {}

  create(dto: CreateEnterpriseDecisionDto): EnterpriseDecisionRecord {
    if (!dto.options?.length) throw new BadRequestException("Decision options are required.");
    const id = randomUUID();
    const now = new Date().toISOString();
    const context = dto.context ?? {};
    const policyResult = this.policyService.evaluate(dto.options, context);
    const ruleResult = this.ruleService.evaluate(dto.options, context);
    const simulations = this.simulationService.simulate(dto.options);
    const recommendations = this.recommendationService.rank(simulations, ruleResult);
    const confidence = recommendations.length ? Math.round(recommendations.reduce((sum, item) => sum + item.confidence, 0) / recommendations.length) : 0;
    const record: EnterpriseDecisionRecord = {
      id,
      subject: dto.subject,
      context: { ...context, requireHumanApproval: dto.requireHumanApproval ?? false },
      options: dto.options.map(option => ({ ...option })),
      recommendations,
      status: policyResult.allowed ? "recommended" : "rejected",
      riskLevel: this.resolveRiskLevel(dto.options),
      confidence,
      explanation: this.buildExplanation(policyResult.allowed, recommendations, policyResult.reasons, ruleResult.reasons),
      policyResult,
      ruleResult,
      simulations,
      traces: [
        this.trace(id, "created", "Decision request created."),
        this.trace(id, "policy", "Policy evaluation completed.", { allowed: policyResult.allowed }),
        this.trace(id, "rules", "Rule evaluation completed.", { matchedRules: ruleResult.matchedRules }),
        this.trace(id, "simulation", "Options simulated.", { count: simulations.length }),
        this.trace(id, "recommendation", "Recommendations ranked.", { count: recommendations.length })
      ],
      createdAt: now,
      updatedAt: now
    };
    return this.memoryService.save(record);
  }

  evaluate(id: string, dto: EvaluateDecisionDto): EnterpriseDecisionRecord {
    const existing = this.memoryService.findById(id);
    const context = { ...existing.context, ...(dto.contextPatch ?? {}) };
    const policyResult = this.policyService.evaluate(existing.options, context);
    const ruleResult = this.ruleService.evaluate(existing.options, context);
    const simulations = this.simulationService.simulate(existing.options);
    const recommendations = this.recommendationService.rank(simulations, ruleResult);
    return this.memoryService.save({ ...existing, context, policyResult, ruleResult, simulations, recommendations, status: policyResult.allowed ? "recommended" : "rejected", explanation: this.buildExplanation(policyResult.allowed, recommendations, policyResult.reasons, ruleResult.reasons), traces: [...existing.traces, this.trace(id, "reevaluated", "Decision was reevaluated.")], updatedAt: new Date().toISOString() });
  }

  select(id: string, dto: SelectDecisionOptionDto): EnterpriseDecisionRecord {
    const existing = this.memoryService.findById(id);
    if (!existing.policyResult.allowed) throw new BadRequestException("A rejected decision cannot be approved.");
    if (!existing.options.some(option => option.id === dto.optionId)) throw new BadRequestException(`Option ${dto.optionId} does not exist.`);
    if (existing.context["requireHumanApproval"] === true && !dto.approvedBy) throw new BadRequestException("approvedBy is required for human approval.");
    return this.memoryService.save({ ...existing, selectedOptionId: dto.optionId, status: "approved", explanation: [...existing.explanation, `Option ${dto.optionId} was approved.`, ...(dto.approvedBy ? [`Approved by ${dto.approvedBy}.`] : [])], traces: [...existing.traces, this.trace(id, "approved", "Decision option approved.", { optionId: dto.optionId, approvedBy: dto.approvedBy })], updatedAt: new Date().toISOString() });
  }

  execute(id: string): EnterpriseDecisionRecord {
    const existing = this.memoryService.findById(id);
    if (existing.status !== "approved") throw new BadRequestException("Only an approved decision can be executed.");
    return this.memoryService.save({ ...existing, status: "executed", traces: [...existing.traces, this.trace(id, "executed", "Decision marked as executed.", { selectedOptionId: existing.selectedOptionId })], updatedAt: new Date().toISOString() });
  }

  findAll(): EnterpriseDecisionRecord[] { return this.memoryService.findAll(); }
  findById(id: string): EnterpriseDecisionRecord { return this.memoryService.findById(id); }
  status(): Record<string, unknown> { return { success: true, system: "AVOS Enterprise Decision Intelligence", status: "operational", decisionCount: this.memoryService.count(), capabilities: ["decision-engine", "policy-engine", "rule-engine", "decision-memory", "decision-scoring", "explainable-decisions", "simulation-engine", "recommendation-engine", "human-approval"], timestamp: new Date().toISOString() }; }

  private resolveRiskLevel(options: Array<{ risk: number }>): DecisionRiskLevel {
    const highestRisk = Math.max(...options.map(option => option.risk));
    if (highestRisk >= 90) return "critical";
    if (highestRisk >= 70) return "high";
    if (highestRisk >= 40) return "medium";
    return "low";
  }

  private buildExplanation(allowed: boolean, recommendations: Array<{ rank: number; optionId: string; score: number }>, policyReasons: string[], ruleReasons: string[]): string[] {
    const explanation = [allowed ? "Decision passed policy evaluation." : "Decision failed policy evaluation.", ...policyReasons, ...ruleReasons];
    const best = recommendations.find(item => item.rank === 1);
    if (best) explanation.push(`Recommended option ${best.optionId} with score ${best.score}.`);
    return explanation;
  }

  private trace(decisionId: string, step: string, message: string, data?: Record<string, unknown>): DecisionTrace {
    return { id: randomUUID(), decisionId, step, message, data, createdAt: new Date().toISOString() };
  }
}