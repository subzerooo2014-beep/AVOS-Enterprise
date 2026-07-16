import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { F5_CAPABILITIES } from "./enterprise-ultimate-f5.registry";
import {
  F5Activity,
  F5Briefing,
  F5DigitalEmployee,
  F5Mission,
  F5Workspace,
} from "./enterprise-ultimate-f5.types";

@Injectable()
export class EnterpriseUltimateF5Service {
  private readonly workspaces = new Map<string, F5Workspace>();
  private readonly missions = new Map<string, F5Mission>();
  private readonly briefings = new Map<string, F5Briefing>();
  private readonly activities = new Map<string, F5Activity>();
  private readonly employees = new Map<string, F5DigitalEmployee>();

  framework() {
    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F5",
      version: "1.0.0",
      status: "READY",
      capabilityCount: Object.keys(F5_CAPABILITIES).length,
      capabilities: structuredClone(F5_CAPABILITIES),
    };
  }

  createWorkspace(
    input: Omit<F5Workspace, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const workspace: F5Workspace = {
      ...input,
      id: randomUUID(),
      widgets: [...input.widgets],
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.workspaces.set(workspace.id, workspace);
    return this.cloneWorkspace(workspace);
  }

  personalizeWorkspace(
    id: string,
    input: {
      theme?: F5Workspace["theme"];
      direction?: F5Workspace["direction"];
      widgets?: string[];
    },
  ) {
    const workspace = this.requireWorkspace(id);

    if (input.theme) workspace.theme = input.theme;
    if (input.direction) workspace.direction = input.direction;
    if (input.widgets) workspace.widgets = [...input.widgets];

    workspace.updatedAt = new Date().toISOString();
    this.workspaces.set(id, workspace);

    return this.cloneWorkspace(workspace);
  }

  createMission(
    input: Omit<F5Mission, "id" | "status" | "progress" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const mission: F5Mission = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      progress: 0,
      actions: [...input.actions],
      createdAt: now,
      updatedAt: now,
    };

    this.missions.set(mission.id, mission);
    return this.cloneMission(mission);
  }

  updateMissionProgress(id: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    const mission = this.requireMission(id);
    mission.progress = progress;
    mission.status =
      progress >= 100 ? "COMPLETED" : progress > 0 ? "RUNNING" : "OPEN";
    mission.updatedAt = new Date().toISOString();

    this.missions.set(id, mission);
    return this.cloneMission(mission);
  }

  createBriefing(
    input: Omit<F5Briefing, "id" | "createdAt">,
  ) {
    const briefing: F5Briefing = {
      ...input,
      id: randomUUID(),
      priorities: [...input.priorities],
      opportunities: [...input.opportunities],
      risks: [...input.risks],
      createdAt: new Date().toISOString(),
    };

    this.briefings.set(briefing.id, briefing);
    return this.cloneBriefing(briefing);
  }

  publishActivity(
    input: Omit<F5Activity, "id" | "createdAt">,
  ) {
    const activity: F5Activity = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.activities.set(activity.id, activity);
    return { ...activity };
  }

  createDigitalEmployee(
    input: Omit<
      F5DigitalEmployee,
      "id" | "status" | "assignedTasks" | "completedTasks" | "createdAt" | "updatedAt"
    >,
  ) {
    const now = new Date().toISOString();
    const employee: F5DigitalEmployee = {
      ...input,
      id: randomUUID(),
      status: "ACTIVE",
      assignedTasks: 0,
      completedTasks: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.employees.set(employee.id, employee);
    return { ...employee };
  }

  assignDigitalEmployee(id: string) {
    const employee = this.requireEmployee(id);
    employee.assignedTasks += 1;
    employee.updatedAt = new Date().toISOString();
    this.employees.set(id, employee);
    return { ...employee };
  }

  completeDigitalEmployeeTask(id: string) {
    const employee = this.requireEmployee(id);

    if (employee.completedTasks >= employee.assignedTasks) {
      throw new Error("No assigned task is waiting for completion");
    }

    employee.completedTasks += 1;
    employee.updatedAt = new Date().toISOString();
    this.employees.set(id, employee);
    return { ...employee };
  }

  commandPalette(query: string, tenantId?: string) {
    const normalized = query.trim().toLowerCase();

    const workspaces = Array.from(this.workspaces.values()).filter(
      (item) =>
        (!tenantId || item.tenantId === tenantId) &&
        item.name.toLowerCase().includes(normalized),
    );

    const missions = Array.from(this.missions.values()).filter(
      (item) =>
        (!tenantId || item.tenantId === tenantId) &&
        item.title.toLowerCase().includes(normalized),
    );

    const activities = Array.from(this.activities.values()).filter(
      (item) =>
        (!tenantId || item.tenantId === tenantId) &&
        item.title.toLowerCase().includes(normalized),
    );

    return {
      query,
      workspaces: workspaces.map((item) => this.cloneWorkspace(item)),
      missions: missions.map((item) => this.cloneMission(item)),
      activities: activities.map((item) => ({ ...item })),
      total: workspaces.length + missions.length + activities.length,
    };
  }

  cockpit(tenantId?: string) {
    const workspaces = this.filterTenant(
      Array.from(this.workspaces.values()),
      tenantId,
    );
    const missions = this.filterTenant(
      Array.from(this.missions.values()),
      tenantId,
    );
    const briefings = this.filterTenant(
      Array.from(this.briefings.values()),
      tenantId,
    );
    const activities = this.filterTenant(
      Array.from(this.activities.values()),
      tenantId,
    );
    const employees = this.filterTenant(
      Array.from(this.employees.values()),
      tenantId,
    );

    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F5",
      tenantId: tenantId ?? "ALL",
      workspaces: workspaces.length,
      activeMissions: missions.filter((item) => item.status !== "COMPLETED").length,
      completedMissions: missions.filter((item) => item.status === "COMPLETED").length,
      briefings: briefings.length,
      liveActivities: activities.length,
      criticalActivities: activities.filter(
        (item) => item.severity === "CRITICAL",
      ).length,
      digitalEmployees: employees.length,
      activeDigitalEmployees: employees.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      missionProgress:
        missions.length === 0
          ? 0
          : Number(
              (
                missions.reduce((sum, item) => sum + item.progress, 0) /
                missions.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireWorkspace(id: string) {
    const item = this.workspaces.get(id);
    if (!item) throw new Error(`Workspace not found: ${id}`);
    return item;
  }

  private requireMission(id: string) {
    const item = this.missions.get(id);
    if (!item) throw new Error(`Mission not found: ${id}`);
    return item;
  }

  private requireEmployee(id: string) {
    const item = this.employees.get(id);
    if (!item) throw new Error(`Digital employee not found: ${id}`);
    return item;
  }

  private filterTenant<T extends { tenantId: string }>(
    items: T[],
    tenantId?: string,
  ) {
    return tenantId
      ? items.filter((item) => item.tenantId === tenantId)
      : items;
  }

  private cloneWorkspace(item: F5Workspace): F5Workspace {
    return {
      ...item,
      widgets: [...item.widgets],
    };
  }

  private cloneMission(item: F5Mission): F5Mission {
    return {
      ...item,
      actions: [...item.actions],
    };
  }

  private cloneBriefing(item: F5Briefing): F5Briefing {
    return {
      ...item,
      priorities: [...item.priorities],
      opportunities: [...item.opportunities],
      risks: [...item.risks],
    };
  }
}