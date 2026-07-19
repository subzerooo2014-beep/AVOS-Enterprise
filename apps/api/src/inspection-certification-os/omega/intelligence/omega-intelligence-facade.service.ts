import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ArchitectureIntelligenceEngineService } from "./architecture-intelligence-engine.service";
import { CiCdIntelligenceEngineService } from "./cicd-intelligence-engine.service";
import { CodeQualityIntelligenceEngineService } from "./code-quality-intelligence-engine.service";
import { ConfigurationIntelligenceEngineService } from "./configuration-intelligence-engine.service";
import { DeadCodeIntelligenceEngineService } from "./dead-code-intelligence-engine.service";
import { DependencyGraphIntelligenceEngineService } from "./dependency-graph-intelligence-engine.service";
import { DockerIntelligenceEngineService } from "./docker-intelligence-engine.service";
import { GitIntelligenceEngineService } from "./git-intelligence-engine.service";
import { NestJsIntelligenceEngineService } from "./nestjs-intelligence-engine.service";
import {
  OmegaIntelligenceReport,
  OmegaIntelligenceSection,
} from "./omega-intelligence.types";
import { PerformanceIntelligenceEngineService } from "./performance-intelligence-engine.service";
import { PrismaIntelligenceEngineService } from "./prisma-intelligence-engine.service";
import { ReleaseReadinessEngineService } from "./release-readiness-engine.service";
import { SecurityIntelligenceEngineService } from "./security-intelligence-engine.service";

@Injectable()
export class OmegaIntelligenceFacadeService {
  private latestReport: OmegaIntelligenceReport | null = null;

  constructor(
    private readonly architecture: ArchitectureIntelligenceEngineService,
    private readonly dependencies: DependencyGraphIntelligenceEngineService,
    private readonly quality: CodeQualityIntelligenceEngineService,
    private readonly deadCode: DeadCodeIntelligenceEngineService,
    private readonly security: SecurityIntelligenceEngineService,
    private readonly configuration: ConfigurationIntelligenceEngineService,
    private readonly nestjs: NestJsIntelligenceEngineService,
    private readonly prisma: PrismaIntelligenceEngineService,
    private readonly performance: PerformanceIntelligenceEngineService,
    private readonly docker: DockerIntelligenceEngineService,
    private readonly cicd: CiCdIntelligenceEngineService,
    private readonly git: GitIntelligenceEngineService,
    private readonly releaseReadiness: ReleaseReadinessEngineService,
  ) {}

  async inspect(
    repositoryRoot: string,
    apiRoot: string,
  ): Promise<OmegaIntelligenceReport> {
    const synchronousSections: OmegaIntelligenceSection[] = [
      this.architecture.inspect(apiRoot),
      this.dependencies.inspect(apiRoot),
      this.quality.inspect(apiRoot),
      this.deadCode.inspect(apiRoot),
      this.security.inspect(repositoryRoot),
      this.configuration.inspect(apiRoot),
      this.nestjs.inspect(apiRoot),
      this.prisma.inspect(apiRoot),
      this.docker.inspect(repositoryRoot),
      this.cicd.inspect(repositoryRoot),
    ];

    const [performance, git] = await Promise.all([
      this.performance.inspect(apiRoot),
      this.git.inspect(repositoryRoot),
    ]);

    const sections = [...synchronousSections, performance, git];

    const overallScore = Number(
      (
        sections.reduce((total, section) => total + section.score, 0) /
        sections.length
      ).toFixed(2),
    );

    const report: OmegaIntelligenceReport = {
      reportId: `OMEGA-INT-${randomUUID()}`,
      generatedAt: new Date().toISOString(),
      version: "2.0.0-omega.2",
      repositoryRoot,
      apiRoot,
      sections,
      overallScore,
      readiness: this.releaseReadiness.evaluate(sections),
      governance: {
        humanFinalAuthority: true,
        autonomousFinalApproval: false,
        nonDestructive: true,
      },
    };

    this.latestReport = report;

    return report;
  }

  latest(): OmegaIntelligenceReport | null {
    return this.latestReport;
  }
}
