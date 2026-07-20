import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AeosGoal } from "./aeos.contracts";

@Injectable()
export class EnterpriseGoalManagerService {
  private readonly goals = new Map<string, AeosGoal>();

  create(input: {
    title: string;
    description?: string;
    priority?: number;
    owner?: string;
    objectives?: AeosGoal["objectives"];
    constraints?: string[];
  }) {
    const now = new Date().toISOString();
    const goal: AeosGoal = {
      id: "aeos-goal:" + randomUUID(),
      title: input.title,
      description: input.description ?? "",
      priority: input.priority ?? 50,
      owner: input.owner ?? "human:khalifa",
      status: "draft",
      objectives:
        input.objectives ?? [
          {
            key: "enterprise-value",
            weight: 1,
            target: 100,
            direction: "maximize",
          },
        ],
      constraints: input.constraints ?? [],
      createdAt: now,
      updatedAt: now,
    };

    this.goals.set(goal.id, goal);
    return goal;
  }

  activate(id: string, approvedBy: string) {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Goal activation requires Human Final Authority.");
    }
    return this.updateStatus(id, "active");
  }

  updateStatus(id: string, status: AeosGoal["status"]) {
    const current = this.get(id);
    const updated = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.goals.set(id, updated);
    return updated;
  }

  get(id: string) {
    const goal = this.goals.get(id);
    if (!goal) throw new Error("AEOS goal not found: " + id);
    return goal;
  }

  list() {
    return [...this.goals.values()].sort((a, b) => b.priority - a.priority);
  }

  active() {
    return this.list().filter((goal) => goal.status === "active");
  }
}