import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryLearningMemoryRecord
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";

@Injectable()
export class AvosFactoryLearningMemoryService {
  private readonly memory: AvosFactoryLearningMemoryRecord[] = [];

  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService
  ) {}

  learn(subjectId: string): AvosFactoryLearningMemoryRecord[] {
    const analyses = this.analyzer.findBySubject(subjectId);
    const created: AvosFactoryLearningMemoryRecord[] = [];

    for (const analysis of analyses.slice(0, 5)) {
      if (analysis.success && analysis.quality.overall >= 85) {
        created.push(
          this.create({
            subjectId,
            memoryType: "success-pattern",
            summary: "High-quality generation pattern captured.",
            evidence: {
              analysisId: analysis.id,
              quality: analysis.quality.overall,
              patterns: analysis.patterns
            },
            confidence: 92
          })
        );
      }

      if (!analysis.success) {
        created.push(
          this.create({
            subjectId,
            memoryType: "failure-pattern",
            summary: "Generation failure pattern captured.",
            evidence: {
              analysisId: analysis.id,
              failures: analysis.failures,
              warnings: analysis.warnings
            },
            confidence: 96
          })
        );
      }

      if (analysis.reusedCapabilities.length > 0) {
        created.push(
          this.create({
            subjectId,
            memoryType: "reuse-pattern",
            summary: "Capability reuse pattern captured.",
            evidence: {
              analysisId: analysis.id,
              capabilities: analysis.reusedCapabilities,
              quality: analysis.quality.overall
            },
            confidence: 88
          })
        );
      }
    }

    this.memory.unshift(...created);
    return created.map((record) => structuredClone(record));
  }

  list(limit = 100): AvosFactoryLearningMemoryRecord[] {
    return this.memory
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((record) => structuredClone(record));
  }

  count(): number {
    return this.memory.length;
  }

  private create(
    input: Omit<AvosFactoryLearningMemoryRecord, "id" | "createdAt">
  ): AvosFactoryLearningMemoryRecord {
    return {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString()
    };
  }
}
