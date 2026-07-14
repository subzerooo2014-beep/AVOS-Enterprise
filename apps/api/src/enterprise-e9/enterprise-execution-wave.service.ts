import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseDependencyGraphService } from "./enterprise-dependency-graph.service";
import { EnterprisePortfolioPrioritizationService } from "./enterprise-portfolio-prioritization.service";
import { EnterpriseExecutionWave } from "./enterprise-e9.types";

@Injectable()
export class EnterpriseExecutionWaveService {
  private readonly waves: EnterpriseExecutionWave[] = [];

  constructor(
    private readonly portfolio: EnterprisePortfolioPrioritizationService,
    private readonly dependencies: EnterpriseDependencyGraphService,
  ) {}

  generate(name = "Enterprise execution wave"): EnterpriseExecutionWave {
    const ranked = this.portfolio.rank();
    const selected = ranked.slice(0, 3);
    const ready = selected.filter((item) => this.dependencies.isReady(item.id));
    const readinessScore =
      selected.length === 0
        ? 0
        : Math.round((ready.length / selected.length) * 100);

    const wave: EnterpriseExecutionWave = {
      id: randomUUID(),
      name,
      initiativeIds: selected.map((item) => item.id),
      sequence: this.waves.length + 1,
      readinessScore,
      approved: readinessScore >= 60,
      generatedAt: new Date().toISOString(),
    };

    this.waves.push(wave);
    return wave;
  }

  list(): EnterpriseExecutionWave[] {
    return [...this.waves];
  }

  count(): number {
    return this.waves.length;
  }
}