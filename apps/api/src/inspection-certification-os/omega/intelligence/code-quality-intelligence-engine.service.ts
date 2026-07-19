import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import {
  OmegaIntelligenceFinding,
  OmegaIntelligenceSection,
} from "./omega-intelligence.types";

@Injectable()
export class CodeQualityIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(apiRoot: string): OmegaIntelligenceSection {
    const files = this.fileSystem
      .listFiles(apiRoot, 6000)
      .filter((file: string) => file.endsWith(".ts"));

    let anyCount = 0;
    let todoCount = 0;
    let consoleCount = 0;
    let tsIgnoreCount = 0;

    for (const file of files) {
      const content = this.fileSystem.readText(
        this.fileSystem.resolve(apiRoot, file),
      );

      anyCount += (content.match(/\bany\b/g) ?? []).length;
      todoCount += (content.match(/\bTODO\b|\bFIXME\b/g) ?? []).length;
      consoleCount += (
        content.match(/console\.(log|warn|error|debug)\s*\(/g) ?? []
      ).length;
      tsIgnoreCount += (content.match(/@ts-ignore/g) ?? []).length;
    }

    const penalty =
      Math.min(30, anyCount / 20) +
      Math.min(25, todoCount * 2) +
      Math.min(20, consoleCount / 10) +
      Math.min(25, tsIgnoreCount * 5);

    const score = Number(Math.max(0, 100 - penalty).toFixed(2));
    const findings: OmegaIntelligenceFinding[] = [];

    if (tsIgnoreCount > 0) {
      findings.push({
        id: `omega.quality.${randomUUID()}`,
        category: "code-quality",
        severity: "medium",
        title: "TypeScript suppression directives detected",
        description: `${tsIgnoreCount} @ts-ignore directive(s) were detected.`,
        evidence: [{ tsIgnoreCount }],
        recommendations: [
          "Replace suppression directives with explicit type-safe solutions.",
        ],
      });
    }

    return {
      name: "code-quality-intelligence",
      status:
        score >= 85 ? "healthy" : score >= 65 ? "attention" : "critical",
      score,
      findings,
      metrics: {
        filesAnalyzed: files.length,
        anyCount,
        todoCount,
        consoleCount,
        tsIgnoreCount,
      },
    };
  }
}

