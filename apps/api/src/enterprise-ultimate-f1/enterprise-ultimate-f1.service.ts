import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { F1_CAPABILITIES } from "./enterprise-ultimate-f1.registry";
import {
  F1Activity,
  F1Command,
  F1Recommendation,
  F1Widget,
  F1Workspace,
} from "./enterprise-ultimate-f1.types";

@Injectable()
export class EnterpriseUltimateF1Service {
  private readonly workspaces = new Map<string, F1Workspace>();
  private readonly widgets = new Map<string, F1Widget>();
  private readonly activities = new Map<string, F1Activity>();
  private readonly commands = new Map<string, F1Command>();
  private readonly recommendations = new Map<string, F1Recommendation>();

  framework() {
    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F1",
      version: "1.0.0",
      status: "READY",
      capabilityCount: Object.keys(F1_CAPABILITIES).length,
      capabilities: structuredClone(F1_CAPABILITIES),
    };
  }

  createWorkspace(
    input: Omit<F1Workspace, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const workspace: F1Workspace = {
      ...input,
      id: randomUUID(),
      widgets: [...input.widgets],
      navigation: [...input.navigation],
      createdAt: now,
      updatedAt: now,
    };
    this.workspaces.set(workspace.id, workspace);
    return this.cloneWorkspace(workspace);
  }

  createWidget(
    input: Omit<F1Widget, "id" | "createdAt" | "updatedAt">,
  ) {
    if (!F1_CAPABILITIES[input.capability]) {
      throw new Error(`Unknown capability: ${input.capability}`);
    }

    const now = new Date().toISOString();
    const widget: F1Widget = {
      ...input,
      id: randomUUID(),
      layout: { ...input.layout },
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };
    this.widgets.set(widget.id, widget);
    return this.cloneWidget(widget);
  }

  attachWidget(workspaceId: string, widgetId: string) {
    const workspace = this.requireWorkspace(workspaceId);
    this.requireWidget(widgetId);

    if (!workspace.widgets.includes(widgetId)) {
      workspace.widgets.push(widgetId);
      workspace.updatedAt = new Date().toISOString();
      this.workspaces.set(workspaceId, workspace);
    }

    return this.cloneWorkspace(workspace);
  }

  publishActivity(input: Omit<F1Activity, "id" | "createdAt">) {
    const activity: F1Activity = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.activities.set(activity.id, activity);
    return { ...activity };
  }

  dispatchCommand(
    input: Omit<F1Command, "id" | "status" | "result" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const command: F1Command = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      status: "COMPLETED",
      result: { accepted: true, commandType: input.commandType },
      createdAt: now,
      updatedAt: now,
    };
    this.commands.set(command.id, command);
    return this.cloneCommand(command);
  }

  createRecommendation(
    input: Omit<F1Recommendation, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    if (input.confidence < 0 || input.confidence > 100) {
      throw new Error("Confidence must be between 0 and 100");
    }

    const now = new Date().toISOString();
    const recommendation: F1Recommendation = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };
    this.recommendations.set(recommendation.id, recommendation);
    return { ...recommendation };
  }

  acceptRecommendation(id: string) {
    const recommendation = this.requireRecommendation(id);
    recommendation.status = "ACCEPTED";
    recommendation.updatedAt = new Date().toISOString();
    this.recommendations.set(id, recommendation);
    return { ...recommendation };
  }

  search(query: string, tenantId?: string) {
    const q = query.trim().toLowerCase();
    const widgets = Array.from(this.widgets.values()).filter(
      (item) =>
        (!tenantId || item.tenantId === tenantId) &&
        (item.title.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q)),
    );
    const activities = Array.from(this.activities.values()).filter(
      (item) =>
        (!tenantId || item.tenantId === tenantId) &&
        (item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)),
    );
    const recommendations = Array.from(this.recommendations.values()).filter(
      (item) =>
        (!tenantId || item.tenantId === tenantId) &&
        (item.title.toLowerCase().includes(q) ||
          item.rationale.toLowerCase().includes(q)),
    );

    return {
      query,
      widgets: widgets.map((item) => this.cloneWidget(item)),
      activities: activities.map((item) => ({ ...item })),
      recommendations: recommendations.map((item) => ({ ...item })),
      total: widgets.length + activities.length + recommendations.length,
    };
  }

  businessPulse(tenantId: string) {
    const activities = Array.from(this.activities.values()).filter(
      (item) => item.tenantId === tenantId,
    );
    const recommendations = Array.from(this.recommendations.values()).filter(
      (item) => item.tenantId === tenantId,
    );
    const commands = Array.from(this.commands.values()).filter(
      (item) => item.tenantId === tenantId,
    );

    return {
      tenantId,
      activities: activities.length,
      critical: activities.filter((item) => item.severity === "CRITICAL").length,
      openRecommendations: recommendations.filter((item) => item.status === "OPEN").length,
      completedCommands: commands.filter((item) => item.status === "COMPLETED").length,
      status: activities.some((item) => item.severity === "CRITICAL")
        ? "ATTENTION"
        : "HEALTHY",
      generatedAt: new Date().toISOString(),
    };
  }

  commandCenter(tenantId?: string) {
    const tenant = <T extends { tenantId: string }>(items: T[]) =>
      tenantId ? items.filter((item) => item.tenantId === tenantId) : items;

    const workspaces = tenant(Array.from(this.workspaces.values()));
    const widgets = tenant(Array.from(this.widgets.values()));
    const activities = tenant(Array.from(this.activities.values()));
    const commands = tenant(Array.from(this.commands.values()));
    const recommendations = tenant(Array.from(this.recommendations.values()));

    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F1",
      tenantId: tenantId ?? "ALL",
      workspaces: workspaces.length,
      widgets: widgets.length,
      activities: activities.length,
      commands: commands.length,
      completedCommands: commands.filter((item) => item.status === "COMPLETED").length,
      recommendations: recommendations.length,
      openRecommendations: recommendations.filter((item) => item.status === "OPEN").length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireWorkspace(id: string) {
    const item = this.workspaces.get(id);
    if (!item) throw new Error(`Workspace not found: ${id}`);
    return item;
  }

  private requireWidget(id: string) {
    const item = this.widgets.get(id);
    if (!item) throw new Error(`Widget not found: ${id}`);
    return item;
  }

  private requireRecommendation(id: string) {
    const item = this.recommendations.get(id);
    if (!item) throw new Error(`Recommendation not found: ${id}`);
    return item;
  }

  private cloneWorkspace(item: F1Workspace): F1Workspace {
    return { ...item, widgets: [...item.widgets], navigation: [...item.navigation] };
  }

  private cloneWidget(item: F1Widget): F1Widget {
    return {
      ...item,
      layout: { ...item.layout },
      configuration: { ...item.configuration },
    };
  }

  private cloneCommand(item: F1Command): F1Command {
    return {
      ...item,
      payload: { ...item.payload },
      result: { ...item.result },
    };
  }
}