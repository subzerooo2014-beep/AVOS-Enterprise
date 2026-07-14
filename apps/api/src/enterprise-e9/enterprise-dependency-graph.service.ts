import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseDependency } from "./enterprise-e9.types";
import { EnterpriseStrategicInitiativeService } from "./enterprise-strategic-initiative.service";

@Injectable()
export class EnterpriseDependencyGraphService {
  private readonly dependencies: EnterpriseDependency[] = [];

  constructor(
    private readonly initiatives: EnterpriseStrategicInitiativeService,
  ) {}

  add(
    initiativeId: string,
    dependsOnInitiativeId: string,
    critical = true,
  ): EnterpriseDependency {
    this.initiatives.get(initiativeId);
    this.initiatives.get(dependsOnInitiativeId);

    const dependency: EnterpriseDependency = {
      id: randomUUID(),
      initiativeId,
      dependsOnInitiativeId,
      critical,
      createdAt: new Date().toISOString(),
    };

    this.dependencies.push(dependency);

    const count = this.dependencies.filter(
      (item) => item.initiativeId === initiativeId,
    ).length;
    this.initiatives.updateDependencyCount(initiativeId, count);

    return dependency;
  }

  list(): EnterpriseDependency[] {
    return [...this.dependencies];
  }

  listForInitiative(initiativeId: string): EnterpriseDependency[] {
    return this.dependencies.filter(
      (dependency) => dependency.initiativeId === initiativeId,
    );
  }

  isReady(initiativeId: string): boolean {
    const dependencies = this.listForInitiative(initiativeId);
    return dependencies.every((dependency) => {
      const target = this.initiatives.get(dependency.dependsOnInitiativeId);
      return !dependency.critical || target.status === "ACTIVE" || target.status === "COMPLETED";
    });
  }

  count(): number {
    return this.dependencies.length;
  }
}