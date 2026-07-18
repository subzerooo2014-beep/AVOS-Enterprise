import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FactoryExecutionPlan,
  FactoryWorkItem,
} from "./factory-intelligence.contracts";

@Injectable()
export class IntelligentBuildPlannerService {
  createPlan(item: FactoryWorkItem): FactoryExecutionPlan {
    const dependencyOrder = [...new Set(item.dependencies)];
    const parallelGroups =
      dependencyOrder.length > 1
        ? dependencyOrder.map((dependency) => [dependency])
        : [dependencyOrder];

    const risks: string[] = [];
    if (item.estimatedUnits > 60) {
      risks.push("high-resource-demand");
    }
    if (item.dependencies.length > 8) {
      risks.push("complex-dependency-graph");
    }

    return {
      id: randomUUID(),
      workItemId: item.id,
      stages: [
        "blueprint-resolution",
        "dependency-planning",
        "resource-allocation",
        "parallel-generation",
        "integration-validation",
        "quality-certification",
        "release-readiness",
      ],
      dependencyOrder,
      parallelGroups,
      requiredUnits: Math.max(1, item.estimatedUnits),
      expectedQualityScore: risks.length === 0 ? 100 : 92,
      risks,
      createdAt: new Date().toISOString(),
    };
  }
}
