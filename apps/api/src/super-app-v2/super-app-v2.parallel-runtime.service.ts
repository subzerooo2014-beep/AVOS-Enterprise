import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  RuntimeAgent,
  RuntimeAgentResult,
  RuntimeWorkflow,
} from "./super-app-v2.types";
import { SuperAppV2EventBusService } from "./super-app-v2.event-bus.service";

@Injectable()
export class SuperAppV2ParallelRuntimeService {
  private readonly workflows = new Map<string, RuntimeWorkflow>();

  constructor(
    private readonly eventBus: SuperAppV2EventBusService,
  ) {}

  async execute(
    userId: string,
    intent: string,
  ): Promise<RuntimeWorkflow> {
    const workflowId = randomUUID();
    const workflow: RuntimeWorkflow = {
      id: workflowId,
      userId,
      intent,
      status: "RUNNING",
      startedAt: new Date().toISOString(),
      results: [],
      overallScore: 0,
    };

    this.workflows.set(workflowId, workflow);

    this.eventBus.publish({
      workflowId,
      type: "WORKFLOW_STARTED",
      message: "Workflow execution started.",
      payload: { userId, intent },
    });

    const agents: RuntimeAgent[] = [
      "VEHICLE",
      "FINANCE",
      "INSURANCE",
      "WORKSHOP",
      "MARKET",
      "NEGOTIATION",
      "TRUST",
    ];

    const results = await Promise.all(
      agents.map((agent) => this.runWithRetry(workflowId, agent, intent)),
    );

    workflow.results = results;
    workflow.overallScore = Math.round(
      results.reduce((sum, result) => sum + result.score, 0) /
        results.length,
    );

    workflow.status = results.every((result) => result.success)
      ? "COMPLETED"
      : "FAILED";
    workflow.completedAt = new Date().toISOString();

    this.eventBus.publish({
      workflowId,
      type: "WORKFLOW_COMPLETED",
      message: `Workflow ${workflow.status.toLowerCase()}.`,
      payload: {
        overallScore: workflow.overallScore,
        completedAgents: results.filter((result) => result.success).length,
      },
    });

    return workflow;
  }

  private async runWithRetry(
    workflowId: string,
    agent: RuntimeAgent,
    intent: string,
  ): Promise<RuntimeAgentResult> {
    const maxAttempts = 2;
    let lastError = "Unknown error";

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const startedAt = Date.now();

      this.eventBus.publish({
        workflowId,
        type: "AGENT_STARTED",
        agent,
        message: `${agent} agent started.`,
        payload: { attempt },
      });

      try {
        const result = await this.runAgent(agent, intent, attempt);
        const durationMs = Date.now() - startedAt;

        const completed: RuntimeAgentResult = {
          ...result,
          durationMs,
          attempts: attempt,
        };

        this.eventBus.publish({
          workflowId,
          type: "AGENT_COMPLETED",
          agent,
          message: `${agent} agent completed.`,
          payload: {
            score: completed.score,
            durationMs,
            attempts: attempt,
          },
        });

        return completed;
      } catch (error) {
        lastError =
          error instanceof Error ? error.message : "Unknown runtime error";

        this.eventBus.publish({
          workflowId,
          type: "AGENT_FAILED",
          agent,
          message: `${agent} agent failed.`,
          payload: { attempt, error: lastError },
        });
      }
    }

    return {
      agent,
      success: false,
      score: 0,
      durationMs: 0,
      attempts: maxAttempts,
      summary: lastError,
    };
  }

  private async runAgent(
    agent: RuntimeAgent,
    intent: string,
    attempt: number,
  ): Promise<Omit<RuntimeAgentResult, "durationMs" | "attempts">> {
    const baseScores: Record<RuntimeAgent, number> = {
      VEHICLE: 96,
      FINANCE: 92,
      INSURANCE: 91,
      WORKSHOP: 89,
      MARKET: 94,
      NEGOTIATION: 90,
      TRUST: 97,
    };

    await new Promise((resolve) =>
      setTimeout(resolve, 30 + Math.floor(Math.random() * 50)),
    );

    return {
      agent,
      success: true,
      score: Math.max(0, baseScores[agent] - (attempt - 1)),
      summary: `${agent} completed analysis for: ${intent}`,
    };
  }

  get(id: string): RuntimeWorkflow {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }
    return workflow;
  }

  list(): RuntimeWorkflow[] {
    return [...this.workflows.values()];
  }

  metrics() {
    const workflows = this.list();
    const completed = workflows.filter(
      (workflow) => workflow.status === "COMPLETED",
    );

    const avgScore = completed.length
      ? Math.round(
          completed.reduce(
            (sum, workflow) => sum + workflow.overallScore,
            0,
          ) / completed.length,
        )
      : 0;

    return {
      workflows: workflows.length,
      activeWorkflows: workflows.filter(
        (workflow) => workflow.status === "RUNNING",
      ).length,
      completedWorkflows: completed.length,
      failedWorkflows: workflows.filter(
        (workflow) => workflow.status === "FAILED",
      ).length,
      averageScore: avgScore,
      events: this.eventBus.list().length,
    };
  }
}