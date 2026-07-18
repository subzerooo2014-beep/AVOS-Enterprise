import { Injectable } from "@nestjs/common";
import {
  PlatformExecutionPlan,
  PlatformExecutionWave,
  PlatformValidationFinding
} from "../contracts/platform-dependency.contracts";
import { PlatformDependencyGraphService } from "./platform-dependency-graph.service";
import { PlatformDependencyValidationService } from "./platform-dependency-validation.service";

@Injectable()
export class PlatformExecutionPlannerService {
  constructor(
    private readonly graphService: PlatformDependencyGraphService,
    private readonly validator: PlatformDependencyValidationService
  ) {}

  startup(): PlatformExecutionPlan {
    return this.createPlan("startup");
  }

  shutdown(): PlatformExecutionPlan {
    const startup = this.createPlan("startup");

    return {
      ...startup,
      kind: "shutdown",
      order: [...startup.order].reverse(),
      waves: [...startup.waves]
        .reverse()
        .map((wave, index) => ({
          wave: index + 1,
          services: [...wave.services]
        })),
      generatedAt: new Date().toISOString()
    };
  }

  private createPlan(kind: "startup" | "shutdown"): PlatformExecutionPlan {
    const validation = this.validator.validate();
    const graph = this.graphService.build();
    const findings: PlatformValidationFinding[] = [...validation.findings];

    if (validation.status === "failed") {
      return {
        kind,
        valid: false,
        order: [],
        waves: [],
        findings,
        generatedAt: new Date().toISOString()
      };
    }

    const dependencies = new Map<string, Set<string>>();
    const dependents = new Map<string, Set<string>>();

    for (const node of graph.nodes) {
      dependencies.set(node.serviceId, new Set(node.outgoing));
      dependents.set(node.serviceId, new Set(node.incoming));
    }

    const remaining = new Set(graph.nodes.map((node) => node.serviceId));
    const order: string[] = [];
    const waves: PlatformExecutionWave[] = [];
    let waveNumber = 1;

    while (remaining.size > 0) {
      const ready = [...remaining]
        .filter((serviceId) => {
          const required = dependencies.get(serviceId) ?? new Set<string>();
          return [...required].every((item) => !remaining.has(item));
        })
        .sort();

      if (ready.length === 0) {
        findings.push({
          code: "PLAN_BLOCKED",
          severity: "error",
          message: "Execution plan is blocked by unresolved dependency ordering."
        });
        break;
      }

      waves.push({ wave: waveNumber++, services: ready });
      order.push(...ready);

      for (const serviceId of ready) {
        remaining.delete(serviceId);
      }
    }

    return {
      kind,
      valid: remaining.size === 0,
      order,
      waves,
      findings,
      generatedAt: new Date().toISOString()
    };
  }
}