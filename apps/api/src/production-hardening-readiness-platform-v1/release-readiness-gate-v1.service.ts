import { Injectable } from "@nestjs/common";
import type { ReleaseReadinessGateV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class ReleaseReadinessGateV1Service {
  private readonly gates = new Map<string, ReleaseReadinessGateV1>();

  evaluate(
    id: string,
    name: string,
    required: boolean,
    passed: boolean,
    evidence: string[] = [],
  ): ReleaseReadinessGateV1 {
    const gate: ReleaseReadinessGateV1 = {
      id,
      name,
      required,
      passed,
      evidence: [...evidence],
      checkedAt: new Date().toISOString(),
    };

    this.gates.set(id, gate);
    return this.clone(gate);
  }

  list(): ReleaseReadinessGateV1[] {
    return Array.from(this.gates.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.gates.size;
  }

  passedCount(): number {
    return this.list().filter((item) => item.passed).length;
  }

  requiredFailures(): ReleaseReadinessGateV1[] {
    return this.list().filter((item) => item.required && !item.passed);
  }

  private clone(item: ReleaseReadinessGateV1): ReleaseReadinessGateV1 {
    return { ...item, evidence: [...item.evidence] };
  }
}
