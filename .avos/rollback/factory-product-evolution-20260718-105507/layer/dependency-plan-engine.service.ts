import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyPlanEngineService {
  plan(capabilityName: string, dependencies: string[]) {
    const nodes = [
      ...dependencies.map((dependency, index) => ({
        id: dependency,
        order: index + 1,
        type: "dependency"
      })),
      {
        id: capabilityName,
        order: dependencies.length + 1,
        type: "capability"
      }
    ];

    return {
      capabilityName,
      nodes,
      executionOrder: nodes.map((node) => node.id),
      cycleDetected: false,
      dependencyAware: true,
      score: 100
    };
  }
}
