import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductionReadinessGateService {
  evaluate(checks: Record<string, boolean>) {
    const entries = Object.entries(checks);
    const failed = entries.filter(([, passed]) => !passed).map(([name]) => name);
    const score = entries.length
      ? Math.round((entries.filter(([, passed]) => passed).length / entries.length) * 100)
      : 0;

    return {
      status: failed.length === 0 ? "ready" : "blocked",
      score,
      failed,
      foundationFirst: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      evaluatedAt: new Date().toISOString(),
    };
  }
}