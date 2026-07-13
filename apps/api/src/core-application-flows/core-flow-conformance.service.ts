import { Injectable } from "@nestjs/common";
import type { FlowConformanceResult } from "./core-flow-standards.types";
import { CoreFlowStandardsRegistryService } from "./core-flow-standards-registry.service";

@Injectable()
export class CoreFlowConformanceService {
  private readonly results: FlowConformanceResult[] = [];

  constructor(
    private readonly standards: CoreFlowStandardsRegistryService,
  ) {}

  test(
    executionId: string,
    standardId: string,
    capabilities: string[],
  ) {
    const standard = this.standards.findOne(standardId);
    const normalized = Array.isArray(capabilities)
      ? capabilities.map(String)
      : [];

    const satisfied = standard.requirements.filter((requirement) =>
      normalized.includes(requirement),
    );
    const missing = standard.requirements.filter(
      (requirement) => !normalized.includes(requirement),
    );

    const result: FlowConformanceResult = {
      id: `conformance_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      standardId,
      passed: missing.length === 0,
      satisfied,
      missing,
      testedAt: new Date().toISOString(),
    };

    this.results.push(result);
    return { result, standard };
  }

  findAll(query: any = {}) {
    return this.results
      .filter(
        (item) =>
          !query.executionId || item.executionId === query.executionId,
      )
      .filter(
        (item) =>
          !query.standardId || item.standardId === query.standardId,
      )
      .slice()
      .reverse();
  }

  dashboard() {
    return {
      total: this.results.length,
      passed: this.results.filter((item) => item.passed).length,
      failed: this.results.filter((item) => !item.passed).length,
      passRate: this.results.length
        ? Number(
            (
              (this.results.filter((item) => item.passed).length /
                this.results.length) *
              100
            ).toFixed(2),
          )
        : 100,
      generatedAt: new Date().toISOString(),
    };
  }
}
