import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { F2_CAPABILITIES } from "./enterprise-ultimate-f2.registry";
import {
  F2Decision,
  F2Goal,
  F2Insight,
  F2Metric,
  F2Task,
} from "./enterprise-ultimate-f2.types";

@Injectable()
export class EnterpriseUltimateF2Service {
  private readonly metrics = new Map<string, F2Metric>();
  private readonly decisions = new Map<string, F2Decision>();
  private readonly tasks = new Map<string, F2Task>();
  private readonly insights = new Map<string, F2Insight>();
  private readonly goals = new Map<string, F2Goal>();

  framework() {
    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F2",
      version: "1.0.0",
      status: "READY",
      capabilityCount: Object.keys(F2_CAPABILITIES).length,
      capabilities: structuredClone(F2_CAPABILITIES),
    };
  }

  recordMetric(input: Omit<F2Metric, "id" | "status" | "recordedAt">) {
    const ratio = input.target && input.target !== 0 ? input.value / input.target : 1;
    const metric: F2Metric = {
      ...input,
      id: randomUUID(),
      status: ratio >= 1 ? "HEALTHY" : ratio >= 0.8 ? "ATTENTION" : "CRITICAL",
      recordedAt: new Date().toISOString(),
    };
    this.metrics.set(metric.id, metric);
    return { ...metric };
  }

  createDecision(
    input: Omit<
      F2Decision,
      "id" | "approved" | "executed" | "createdAt" | "updatedAt"
    >,
  ) {
    if (input.confidence < 0 || input.confidence > 100) {
      throw new Error("Confidence must be between 0 and 100");
    }

    const now = new Date().toISOString();
    const decision: F2Decision = {
      ...input,
      id: randomUUID(),
      approved: false,
      executed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.decisions.set(decision.id, decision);
    return { ...decision };
  }

  approveDecision(id: string) {
    const item = this.requireDecision(id);
    item.approved = true;
    item.updatedAt = new Date().toISOString();
    this.decisions.set(id, item);
    return { ...item };
  }

  executeDecision(id: string) {
    const item = this.requireDecision(id);
    if (!item.approved) throw new Error("Decision must be approved first");
    item.executed = true;
    item.updatedAt = new Date().toISOString();
    this.decisions.set(id, item);
    return { ...item };
  }

  createTask(
    input: Omit<F2Task, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const task: F2Task = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(task.id, task);
    return { ...task };
  }

  completeTask(id: string) {
    const item = this.requireTask(id);
    item.status = "COMPLETED";
    item.updatedAt = new Date().toISOString();
    this.tasks.set(id, item);
    return { ...item };
  }

  createInsight(
    input: Omit<F2Insight, "id" | "createdAt">,
  ) {
    if (input.confidence < 0 || input.confidence > 100) {
      throw new Error("Confidence must be between 0 and 100");
    }

    const insight: F2Insight = {
      ...input,
      id: randomUUID(),
      actions: [...input.actions],
      createdAt: new Date().toISOString(),
    };
    this.insights.set(insight.id, insight);
    return { ...insight, actions: [...insight.actions] };
  }

  createGoal(
    input: Omit<F2Goal, "id" | "progress" | "status" | "createdAt" | "updatedAt">,
  ) {
    const progress = input.target === 0 ? 100 : Number(((input.actual / input.target) * 100).toFixed(2));
    const now = new Date().toISOString();

    const goal: F2Goal = {
      ...input,
      id: randomUUID(),
      progress,
      status: progress >= 100 ? "ON_TRACK" : progress >= 80 ? "AT_RISK" : "OFF_TRACK",
      createdAt: now,
      updatedAt: now,
    };
    this.goals.set(goal.id, goal);
    return { ...goal };
  }

  executiveDashboard(tenantId?: string) {
    const metricItems = this.filterTenant(Array.from(this.metrics.values()), tenantId);
    const decisionItems = this.filterTenant(Array.from(this.decisions.values()), tenantId);
    const taskItems = this.filterTenant(Array.from(this.tasks.values()), tenantId);
    const insightItems = this.filterTenant(Array.from(this.insights.values()), tenantId);
    const goalItems = this.filterTenant(Array.from(this.goals.values()), tenantId);

    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F2",
      tenantId: tenantId ?? "ALL",
      metrics: metricItems.length,
      healthyMetrics: metricItems.filter((item) => item.status === "HEALTHY").length,
      criticalMetrics: metricItems.filter((item) => item.status === "CRITICAL").length,
      decisions: decisionItems.length,
      approvedDecisions: decisionItems.filter((item) => item.approved).length,
      executedDecisions: decisionItems.filter((item) => item.executed).length,
      openTasks: taskItems.filter((item) => item.status !== "COMPLETED").length,
      completedTasks: taskItems.filter((item) => item.status === "COMPLETED").length,
      insights: insightItems.length,
      goals: goalItems.length,
      onTrackGoals: goalItems.filter((item) => item.status === "ON_TRACK").length,
      generatedAt: new Date().toISOString(),
    };
  }

  businessHealth(tenantId: string) {
    const metricItems = this.filterTenant(Array.from(this.metrics.values()), tenantId);
    const critical = metricItems.filter((item) => item.status === "CRITICAL").length;
    const attention = metricItems.filter((item) => item.status === "ATTENTION").length;

    return {
      tenantId,
      status: critical > 0 ? "CRITICAL" : attention > 0 ? "ATTENTION" : "HEALTHY",
      criticalMetrics: critical,
      attentionMetrics: attention,
      totalMetrics: metricItems.length,
      generatedAt: new Date().toISOString(),
    };
  }

  private filterTenant<T extends { tenantId: string }>(items: T[], tenantId?: string) {
    return tenantId ? items.filter((item) => item.tenantId === tenantId) : items;
  }

  private requireDecision(id: string) {
    const item = this.decisions.get(id);
    if (!item) throw new Error(`Decision not found: ${id}`);
    return item;
  }

  private requireTask(id: string) {
    const item = this.tasks.get(id);
    if (!item) throw new Error(`Task not found: ${id}`);
    return item;
  }
}