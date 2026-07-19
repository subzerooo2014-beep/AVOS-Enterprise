import { Controller, Get, Post } from "@nestjs/common";
import { resolve } from "node:path";
import { OmegaIntelligenceFacadeService } from "./omega-intelligence-facade.service";
import { ProductionReadinessEngineService } from "./production-readiness-engine.service";

@Controller("inspection-certification/omega/intelligence")
export class OmegaIntelligenceController {
  constructor(
    private readonly facade: OmegaIntelligenceFacadeService,
    private readonly productionReadinessEngine: ProductionReadinessEngineService,
  ) {}

  @Get("status")
  status() {
    return {
      system: "AVOS Omega Intelligence Layer",
      pack: "Mega Pack Omega-1 Part 2",
      version: "2.0.0-omega.2",
      status: "healthy",
      engines: 14,
      humanFinalAuthority: true,
      autonomousFinalApproval: false,
      nonDestructive: true,
      next: "Omega-1 Part 3",
    };
  }

  @Post("inspect")
  inspect() {
    const apiRoot = process.cwd();
    const repositoryRoot = resolve(apiRoot, "..", "..");

    return this.facade.inspect(repositoryRoot, apiRoot);
  }

  @Get("latest")
  latest() {
    return {
      available: this.facade.latest() !== null,
      report: this.facade.latest(),
    };
  }

  @Get("production-readiness")
  productionReadiness() {
    const report = this.facade.latest();

    if (!report) {
      return {
        available: false,
        reason: "Run POST /inspection-certification/omega/intelligence/inspect first.",
        humanFinalAuthority: true,
      };
    }

    return {
      available: true,
      reportId: report.reportId,
      ...this.productionReadinessEngine.classify(report),
    };
  }
}

