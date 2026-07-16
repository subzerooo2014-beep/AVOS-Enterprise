import { Injectable } from "@nestjs/common";
import type { SecurityReadinessCheckV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class SecurityReadinessV1Service {
  private readonly checks: SecurityReadinessCheckV1[] = [];

  record(
    name: string,
    passed: boolean,
    severity: SecurityReadinessCheckV1["severity"],
    details: string[] = [],
  ): SecurityReadinessCheckV1 {
    const check: SecurityReadinessCheckV1 = {
      id: `security-readiness-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      passed,
      severity,
      details: [...details],
      checkedAt: new Date().toISOString(),
    };

    this.checks.unshift(check);
    return this.clone(check);
  }

  list(): SecurityReadinessCheckV1[] {
    return this.checks.map((item) => this.clone(item));
  }

  count(): number {
    return this.checks.length;
  }

  failedCount(): number {
    return this.checks.filter((item) => !item.passed).length;
  }

  private clone(item: SecurityReadinessCheckV1): SecurityReadinessCheckV1 {
    return { ...item, details: [...item.details] };
  }
}
