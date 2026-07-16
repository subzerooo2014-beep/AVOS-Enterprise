import { Injectable } from "@nestjs/common";
import type { MultiNodeValidationV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class MultiNodeValidationV1Service {
  private readonly validations: MultiNodeValidationV1[] = [];

  validate(
    nodes: string[],
    quorumRequired: number,
    healthyNodes: number,
    replicationHealthy: boolean,
  ): MultiNodeValidationV1 {
    const validation: MultiNodeValidationV1 = {
      id: `multi-node-validation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      nodes: [...nodes],
      quorumRequired,
      healthyNodes,
      replicationHealthy,
      passed: healthyNodes >= quorumRequired && replicationHealthy,
      checkedAt: new Date().toISOString(),
    };

    this.validations.unshift(validation);
    return this.clone(validation);
  }

  list(): MultiNodeValidationV1[] {
    return this.validations.map((item) => this.clone(item));
  }

  count(): number {
    return this.validations.length;
  }

  passedCount(): number {
    return this.validations.filter((item) => item.passed).length;
  }

  private clone(item: MultiNodeValidationV1): MultiNodeValidationV1 {
    return { ...item, nodes: [...item.nodes] };
  }
}
