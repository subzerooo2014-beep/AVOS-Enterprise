import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryGenerationAnalysis
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryQualityScoringService
} from "./avos-factory-quality-scoring.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryGenerationAnalyzerService {
  private readonly analyses: AvosFactoryGenerationAnalysis[] = [];

  constructor(
    private readonly quality: AvosFactoryQualityScoringService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  analyze(input: {
    subjectId: string;
    actor: string;
    source?: AvosFactoryGenerationAnalysis["source"];
    success: boolean;
    durationMs?: number;
    filesGenerated?: number;
    warnings?: string[];
    failures?: string[];
    reusedCapabilities?: string[];
    templateId?: string;
    blueprintId?: string;
    quality?: Partial<{
      architecture: number;
      maintainability: number;
      scalability: number;
      security: number;
      documentation: number;
      reliability: number;
      reuse: number;
    }>;
  }): AvosFactoryGenerationAnalysis {
    const quality = this.quality.calculate({
      architecture: input.quality?.architecture,
      maintainability: input.quality?.maintainability,
      scalability: input.quality?.scalability,
      security: input.quality?.security,
      documentation: input.quality?.documentation,
      reliability: input.quality?.reliability,
      reuse: input.quality?.reuse
    });

    const patterns: string[] = [];

    if (input.success && quality.overall >= 85) {
      patterns.push("high-quality-success");
    }

    if (!input.success) {
      patterns.push("generation-failure");
    }

    if ((input.reusedCapabilities?.length ?? 0) >= 2) {
      patterns.push("strong-capability-reuse");
    }

    if ((input.durationMs ?? 0) > 30000) {
      patterns.push("slow-generation");
    }

    if ((input.warnings?.length ?? 0) > 3) {
      patterns.push("warning-heavy-generation");
    }

    const analysis: AvosFactoryGenerationAnalysis = {
      id: randomUUID(),
      subjectId: input.subjectId,
      actor: input.actor,
      source: input.source ?? "manual",
      success: input.success,
      durationMs: Math.max(0, input.durationMs ?? 0),
      filesGenerated: Math.max(0, input.filesGenerated ?? 0),
      warnings: [...(input.warnings ?? [])],
      failures: [...(input.failures ?? [])],
      reusedCapabilities: [...(input.reusedCapabilities ?? [])],
      templateId: input.templateId,
      blueprintId: input.blueprintId,
      quality,
      patterns,
      analyzedAt: new Date().toISOString()
    };

    this.analyses.unshift(analysis);

    this.audit.append({
      category: "governance",
      action: "factory-generation-analyzed",
      actor: input.actor,
      success: true,
      resourceId: analysis.id,
      details: {
        subjectId: input.subjectId,
        success: input.success,
        quality: quality.overall,
        patterns
      }
    });

    return structuredClone(analysis);
  }

  list(limit = 100): AvosFactoryGenerationAnalysis[] {
    return this.analyses
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((analysis) => structuredClone(analysis));
  }

  all(): AvosFactoryGenerationAnalysis[] {
    return this.analyses.map((analysis) => structuredClone(analysis));
  }

  findBySubject(subjectId: string): AvosFactoryGenerationAnalysis[] {
    return this.analyses
      .filter((analysis) => analysis.subjectId === subjectId)
      .map((analysis) => structuredClone(analysis));
  }
}
