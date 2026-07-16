import { Injectable } from "@nestjs/common";
import {
  BrainReasoningRun,
  BrainReasoningStep
} from "../enterprise-brain-mega-pack-3.types";
import { BrainRuleRegistryService } from "./brain-rule-registry.service";
import { BrainConstraintEngineService } from "../constraints/brain-constraint-engine.service";
import { BrainCausalGraphService } from "../causal/brain-causal-graph.service";
import { BrainDecisionGraphService } from "../decision-graph/brain-decision-graph.service";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainReasoningEngineService {
  private readonly runs = new Map<string, BrainReasoningRun>();

  constructor(
    private readonly rules: BrainRuleRegistryService,
    private readonly constraints: BrainConstraintEngineService,
    private readonly causal: BrainCausalGraphService,
    private readonly decisions: BrainDecisionGraphService,
    private readonly audit: BrainReasoningAuditService
  ) {}

  list() {
    return Array.from(this.runs.values());
  }

  get(id: string) {
    const run = this.runs.get(id);

    if (!run) {
      throw new Error(`Brain reasoning run not found: ${id}`);
    }

    return run;
  }

  execute(input: {
    question: string;
    context: Record<string, unknown>;
    ruleIds: string[];
    constraintIds: string[];
    causalNodeId?: string;
    createdByIdentityId: string;
    correlationId: string;
    traceId?: string;
  }) {
    for (const ruleId of input.ruleIds) {
      this.rules.get(ruleId);
    }

    const now = new Date().toISOString();

    const run: BrainReasoningRun = {
      id: `brain-reasoning-run:${Date.now()}:${this.runs.size + 1}`,
      question: input.question,
      context: input.context,
      ruleIds: Array.from(new Set(input.ruleIds)),
      constraintIds: Array.from(new Set(input.constraintIds)),
      steps: [],
      confidence: 0,
      status: "running",
      correlationId: input.correlationId,
      traceId: input.traceId ?? `brain-trace:${Date.now()}`,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: now
    };

    this.runs.set(run.id, run);

    const addStep = (
      type: BrainReasoningStep["type"],
      stepInput: Record<string, unknown>,
      output: unknown,
      confidence: number,
      rationale: string
    ) => {
      const step: BrainReasoningStep = {
        id: `brain-reasoning-step:${Date.now()}:${run.steps.length + 1}`,
        order: run.steps.length + 1,
        type,
        input: stepInput,
        output,
        confidence,
        status: "completed",
        rationale,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      run.steps.push(step);
      return step;
    };

    try {
      const constraintResult = this.constraints.evaluate(
        run.constraintIds,
        run.context
      );

      addStep(
        "constraint",
        run.context,
        constraintResult,
        constraintResult.passed ? 95 : 40,
        "Evaluated execution constraints."
      );

      if (!constraintResult.passed) {
        run.status = constraintResult.requiresHumanApproval
          ? "blocked"
          : "failed";
        run.confidence = 40;
        run.conclusion = {
          allowed: false,
          reason: "Constraints failed.",
          constraintResult
        };
        run.completedAt = new Date().toISOString();
        this.runs.set(run.id, run);
        return run;
      }

      const activeRules = run.ruleIds.map((id) => this.rules.get(id));

      addStep(
        "rule",
        { ruleIds: run.ruleIds },
        {
          matchedRules: activeRules.map((rule) => rule.id),
          active: activeRules.every((rule) => rule.active)
        },
        90,
        "Applied active enterprise reasoning rules."
      );

      if (input.causalNodeId) {
        const effects = this.causal.effectsOf(input.causalNodeId);

        addStep(
          "causal",
          { causalNodeId: input.causalNodeId },
          effects,
          85,
          "Analyzed causal consequences."
        );
      }

      const decisionGraphResult = this.decisions.evaluate();

      addStep(
        "multi-step",
        { decisionGraph: true },
        decisionGraphResult,
        decisionGraphResult.selected ? 88 : 70,
        "Evaluated decision graph and ranked options."
      );

      run.status = "completed";
      run.confidence = Number(
        (
          run.steps.reduce(
            (sum, step) => sum + step.confidence,
            0
          ) / run.steps.length
        ).toFixed(2)
      );
      run.conclusion = {
        allowed: true,
        selectedDecision:
          decisionGraphResult.selected?.option,
        reasoningSteps: run.steps.length
      };
      run.completedAt = new Date().toISOString();

      this.runs.set(run.id, run);

      this.audit.record({
        correlationId: input.correlationId,
        category: "reasoning",
        action: "brain-reasoning-run-completed",
        subjectId: run.id,
        actorIdentityId: input.createdByIdentityId,
        outcome: "success",
        metadata: {
          confidence: run.confidence,
          steps: run.steps.length
        }
      });

      return run;
    }
    catch (error) {
      run.status = "failed";
      run.confidence = 0;
      run.completedAt = new Date().toISOString();
      run.conclusion = {
        error: error instanceof Error ? error.message : String(error)
      };

      this.runs.set(run.id, run);
      return run;
    }
  }

  summary() {
    const runs = this.list();

    return {
      total: runs.length,
      completed: runs.filter((x) => x.status === "completed").length,
      failed: runs.filter((x) => x.status === "failed").length,
      blocked: runs.filter((x) => x.status === "blocked").length,
      averageConfidence:
        runs.length === 0
          ? 0
          : Number(
              (
                runs.reduce(
                  (sum, run) => sum + run.confidence,
                  0
                ) / runs.length
              ).toFixed(2)
            )
    };
  }
}
