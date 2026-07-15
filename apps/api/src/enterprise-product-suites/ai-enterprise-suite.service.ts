import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AiEnterpriseTask } from "./enterprise-product-suites.types";

@Injectable()
export class AiEnterpriseSuiteService {
  private readonly tasks = new Map<string, AiEnterpriseTask>();

  createTask(
    input: Omit<
      AiEnterpriseTask,
      "id" | "recommendations" | "confidence" | "status" | "createdAt" | "updatedAt"
    >,
  ): AiEnterpriseTask {
    const now = new Date().toISOString();

    const task: AiEnterpriseTask = {
      ...input,
      id: randomUUID(),
      input: { ...input.input },
      recommendations: [],
      confidence: 0,
      status: "QUEUED",
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return this.clone(task);
  }

  completeTask(
    id: string,
    recommendations: string[],
    confidence: number,
  ): AiEnterpriseTask {
    const task = this.requireTask(id);

    if (confidence < 0 || confidence > 100) {
      throw new Error("confidence must be between 0 and 100");
    }

    task.recommendations = [...recommendations];
    task.confidence = confidence;
    task.status =
      task.humanFinalDecisionRequired || confidence < 70
        ? "REVIEW_REQUIRED"
        : "COMPLETED";
    task.updatedAt = new Date().toISOString();

    this.tasks.set(id, task);
    return this.clone(task);
  }

  dashboard() {
    const tasks = Array.from(this.tasks.values());

    return {
      tasks: tasks.length,
      executive: tasks.filter((item) => item.agentType === "EXECUTIVE").length,
      sales: tasks.filter((item) => item.agentType === "SALES").length,
      marketing: tasks.filter((item) => item.agentType === "MARKETING").length,
      finance: tasks.filter((item) => item.agentType === "FINANCE").length,
      support: tasks.filter((item) => item.agentType === "SUPPORT").length,
      operations: tasks.filter((item) => item.agentType === "OPERATIONS").length,
      reviewRequired: tasks.filter((item) => item.status === "REVIEW_REQUIRED").length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireTask(id: string): AiEnterpriseTask {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`AI task not found: ${id}`);
    }
    return task;
  }

  private clone(task: AiEnterpriseTask): AiEnterpriseTask {
    return {
      ...task,
      input: { ...task.input },
      recommendations: [...task.recommendations],
    };
  }
}