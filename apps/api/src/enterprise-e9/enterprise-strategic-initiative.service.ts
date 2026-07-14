import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterprisePriority,
  EnterpriseStrategicInitiative,
} from "./enterprise-e9.types";

@Injectable()
export class EnterpriseStrategicInitiativeService {
  private readonly initiatives = new Map<
    string,
    EnterpriseStrategicInitiative
  >();

  create(input: {
    name?: string;
    domain?: string;
    objective?: string;
    valueScore?: number;
    urgencyScore?: number;
    riskScore?: number;
  }): EnterpriseStrategicInitiative {
    const valueScore = this.clamp(input.valueScore ?? 90);
    const urgencyScore = this.clamp(input.urgencyScore ?? 80);
    const riskScore = this.clamp(input.riskScore ?? 30);
    const weightedScore = valueScore * 0.5 + urgencyScore * 0.35 - riskScore * 0.15;
    const priority: EnterprisePriority =
      weightedScore >= 75
        ? "CRITICAL"
        : weightedScore >= 60
          ? "HIGH"
          : weightedScore >= 40
            ? "MEDIUM"
            : "LOW";

    const initiative: EnterpriseStrategicInitiative = {
      id: randomUUID(),
      name: input.name?.trim() || "AVOS strategic initiative",
      domain: input.domain?.trim() || "enterprise-platform",
      objective:
        input.objective?.trim() ||
        "Increase enterprise platform value and execution readiness.",
      valueScore,
      urgencyScore,
      riskScore,
      dependencyCount: 0,
      priority,
      status: "PLANNED",
      createdAt: new Date().toISOString(),
    };

    this.initiatives.set(initiative.id, initiative);
    return initiative;
  }

  updateDependencyCount(id: string, dependencyCount: number) {
    const initiative = this.get(id);
    initiative.dependencyCount = Math.max(0, dependencyCount);
    return initiative;
  }

  activate(id: string) {
    const initiative = this.get(id);
    initiative.status = "ACTIVE";
    return initiative;
  }

  block(id: string) {
    const initiative = this.get(id);
    initiative.status = "BLOCKED";
    return initiative;
  }

  get(id: string): EnterpriseStrategicInitiative {
    const initiative = this.initiatives.get(id);
    if (!initiative) {
      throw new Error(`Strategic initiative not found: ${id}`);
    }

    return initiative;
  }

  list(): EnterpriseStrategicInitiative[] {
    return [...this.initiatives.values()];
  }

  count(): number {
    return this.initiatives.size;
  }

  activeCount(): number {
    return this.list().filter((item) => item.status === "ACTIVE").length;
  }

  blockedCount(): number {
    return this.list().filter((item) => item.status === "BLOCKED").length;
  }

  private clamp(value: number): number {
    return Math.min(100, Math.max(0, Math.round(value)));
  }
}